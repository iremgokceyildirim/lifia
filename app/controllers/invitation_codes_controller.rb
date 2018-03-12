class InvitationCodesController < ApplicationController

  skip_before_action :check_xhr
  skip_before_action :preload_json, except: [:show]
  skip_before_action :redirect_to_login_if_required

  before_action :ensure_logged_in, only: [:destroy, :create]
  before_action :ensure_new_registrations_allowed, only: [:show]
  before_action :ensure_not_logged_in, only: [:show]

  def show
    expires_now

    invitation_code = InvitationCode.find_by(code: params[:code])

    if invitation_code.present?
      store_preloaded("invitation_code_info", MultiJson.dump(
        owner_user: UserNameSerializer.new(invitation_code.owner_user, scope: guardian, root: false),
        sent_user: UserNameSerializer.new(invitation_code.sent_user, scope: guardian, root: false),
        code: invitation_code.code,
        isSent: invitation_code.isSent,
        isUsed: invitation_code.isUsed)
      )

      render layout: 'application'
    else
      flash.now[:error] = I18n.t('invite.not_found')
      render layout: 'no_ember'
    end
  end

  def create
    current_invitation_code_list = InvitationCode.where(owner_user: current_user)
    #SiteSetting.invitation_code_max_limit.to_f
    if current_invitation_code_list.size < 5
      invitation_code = InvitationCode.new
      invitation_code.owner_user = current_user
      invitation_code.generate_code
      message = "New invitation code" + invitation_code.code.to_s + " is created successfully!"

      if invitation_code.save
        render json: {
          success: true,
          message: message
        }
      else
        errors = invitation_code.errors.to_hash

        render json: {
          success: false,
          message: I18n.t(
            'login.errors',
            errors: invitation_code.errors.full_messages.join("\n")
          ),
          errors: errors
        }
      end
    else
      render json: {
        success: false,
        message: I18n.t(
          'login.errors',
          errors: "You already created 5 invitation codes!"
        )
      }
    end



  end

end
