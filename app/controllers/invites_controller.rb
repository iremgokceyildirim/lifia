require_dependency 'rate_limiter'

class InvitesController < ApplicationController

  skip_before_action :check_xhr, except: [:perform_accept_invitation]
  skip_before_action :preload_json, except: [:show]
  skip_before_action :redirect_to_login_if_required

  before_action :ensure_logged_in, only: [:destroy, :create, :create_invite_link, :create_invitation_code, :rescind_all_invites, :resend_invite, :resend_all_invites, :upload_csv]
  before_action :ensure_new_registrations_allowed, only: [:show, :perform_accept_invitation]
  before_action :ensure_not_logged_in, only: [:show, :perform_accept_invitation]

  def show
    expires_now

    invite = Invite.find_by(invite_key: params[:id])

    if invite.present?
      store_preloaded("invite_info", MultiJson.dump(
        invited_by: UserNameSerializer.new(invite.invited_by, scope: guardian, root: false),
        email: invite.email,
        username: UserNameSuggester.suggest(invite.email))
      )

      render layout: 'application'
    else
      flash.now[:error] = I18n.t('invite.not_found')
      render layout: 'no_ember'
    end
  end

  def perform_accept_invitation
    params.require(:id)
    params.permit(:username, :name, :password, :user_custom_fields)
    invite = Invite.find_by(invite_key: params[:id])

    if invite.present?
      begin
        user = invite.redeem(username: params[:username], name: params[:name], password: params[:password], user_custom_fields: params[:user_custom_fields])
        if user.present?
          log_on_user(user)
          post_process_invite(user)
        end

        topic = user.present? ? invite.topics.first : nil

        render json: {
          success: true,
          redirect_to: topic.present? ? path("#{topic.relative_url}") : path("/")
        }
      rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotSaved => e
        render json: {
          success: false,
          errors: e.record&.errors&.to_hash || {}
        }
      end
    else
      render json: { success: false, message: I18n.t('invite.not_found') }
    end
  end

  def create
    ##params.require(:email)
    ##params.require(:phone_number)

    groups = Group.lookup_groups(
      group_ids: params[:group_ids],
      group_names: params[:group_names]
    )

    guardian.ensure_can_invite_to_forum!(groups)
    group_ids = groups.map(&:id)

    if params[:email]
      invite_exists = Invite.where(email: params[:email], invited_by_id: current_user.id).first
    else
      invite_exists = Invite.where( phone_number: params[:phone_number], invited_by_id: current_user.id).first
    end


    if invite_exists && !guardian.can_send_multiple_invites?(current_user)
      return render json: failed_json, status: 422
    end

    begin
      if params[:email]
        if invitation_code = Invite.invite_by_email(params[:email], params[:label], current_user, nil, group_ids, params[:custom_message])
          #render json: success_json
          render_json_dump(invitation_code)
        else
          render json: failed_json, status: 422
        end
      else
        if invitation_code = Invite.invite_by_sms(params[:phone_number], params[:label], current_user, nil, group_ids, params[:custom_message])
          #render json: success_json
          render_json_dump(invitation_code)
        else
          render json: failed_json, status: 422
        end
      end

    rescue Invite::UserExists, ActiveRecord::RecordInvalid => e
      render json: { errors: [e.message] }, status: 422
    end
  end

  def create_invite_link
    params.require(:email)

    groups = Group.lookup_groups(
      group_ids: params[:group_ids],
      group_names: params[:group_names]
    )

    guardian.ensure_can_invite_to_forum!(groups)
    topic = Topic.find_by(id: params[:topic_id])
    group_ids = groups.map(&:id)

    invite_exists = Invite.where(email: params[:email], invited_by_id: current_user.id).first
    if invite_exists && !guardian.can_send_multiple_invites?(current_user)
      return render json: failed_json, status: 422
    end

    begin
      # generate invite link
      if invite_link = Invite.generate_invite_link(params[:email], current_user, topic, group_ids)
        render_json_dump(invite_link)
      else
        render json: failed_json, status: 422
      end
    rescue => e
      render json: { errors: [e.message] }, status: 422
    end
  end

  def create_invitation_code
    params.require(:label)

    groups = Group.lookup_groups(
      group_ids: params[:group_ids],
      group_names: params[:group_names]
    )

    guardian.ensure_can_invite_to_forum!(groups)
    topic = Topic.find_by(id: params[:topic_id])
    group_ids = groups.map(&:id)

    invite_exists = Invite.where(label: params[:label], invited_by_id: current_user.id).first
    if invite_exists && !guardian.can_send_multiple_invites?(current_user)
      return render json: failed_json, status: 422
    end

    begin
      # generate invite code
      if invitation_code = Invite.generate_invitation_code(params[:label], current_user, params[:custom_message], topic, group_ids)
        render_json_dump(invitation_code)
      else
        render json: failed_json, status: 422
      end
    rescue => e
      render json: { errors: [e.message] }, status: 422
    end
  end

  def destroy
    params.require(:label)

    invite = Invite.find_by(invited_by_id: current_user.id, label: params[:label])
    raise Discourse::InvalidParameters.new(:label) if invite.blank?

    invite.trash!(current_user)

    render body: nil
  end

  def rescind_all_invites
    guardian.ensure_can_rescind_all_invites!(current_user)

    Invite.rescind_all_invites_from(current_user)
    render body: nil
  end

  def resend_invite
    #params.require(:email)

    RateLimiter.new(current_user, "resend-invite-per-hour", 10, 1.hour).performed!

    if params[:email]
      invite = Invite.find_by(invited_by_id: current_user.id, email: params[:email])
      raise Discourse::InvalidParameters.new(:email) if invite.blank?
    else
      invite = Invite.find_by(invited_by_id: current_user.id, phone_number: params[:phone_number])
      raise Discourse::InvalidParameters.new(:phone_number) if invite.blank?
    end

    invite.resend_invite
    render body: nil

  rescue RateLimiter::LimitExceeded
    render_json_error(I18n.t("rate_limiter.slow_down"))
  end

  def resend_all_invites
    guardian.ensure_can_resend_all_invites!(current_user)

    Invite.resend_all_invites_from(current_user.id)
    render body: nil
  end

  def upload_csv
    guardian.ensure_can_bulk_invite_to_forum!(current_user)

    file = params[:file] || params[:files].first
    name = params[:name] || File.basename(file.original_filename, ".*")
    extension = File.extname(file.original_filename)

    Scheduler::Defer.later("Upload CSV") do
      begin
        data = if extension.downcase == ".csv"
          path = Invite.create_csv(file, name)
          Jobs.enqueue(:bulk_invite, filename: "#{name}#{extension}", current_user_id: current_user.id)
          { url: path }
        else
          failed_json.merge(errors: [I18n.t("bulk_invite.file_should_be_csv")])
        end
      rescue
        failed_json.merge(errors: [I18n.t("bulk_invite.error")])
      end
      MessageBus.publish("/uploads/csv", data.as_json, user_ids: [current_user.id])
    end

    render json: success_json
  end

  def fetch_username
    params.require(:username)
    params[:username]
  end

  def fetch_email
    params.require(:email)
    params[:email]
  end

  def ensure_new_registrations_allowed
    unless SiteSetting.allow_new_registrations
      flash[:error] = I18n.t('login.new_registrations_disabled')
      render layout: 'no_ember'
      false
    end
  end

  def ensure_not_logged_in
    if current_user
      flash[:error] = I18n.t("login.already_logged_in", current_user: current_user.username)
      render layout: 'no_ember'
      false
    end
  end

  private

    def post_process_invite(user)
      user.enqueue_welcome_message('welcome_invite') if user.send_welcome_message
      if user.has_password?
        email_token = user.email_tokens.create(email: user.email)
        Jobs.enqueue(:critical_user_email, type: :signup, user_id: user.id, email_token: email_token.token)
      elsif !SiteSetting.enable_sso && SiteSetting.enable_local_logins
        Jobs.enqueue(:invite_password_instructions_email, username: user.username)
      end
    end

end
