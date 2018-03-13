require_dependency 'rate_limiter'
require_dependency 'email_validator'
require_dependency 'email_updater'

class UsersPhoneController < ApplicationController

  before_action :ensure_logged_in, only: [:index, :update]

  skip_before_action :check_xhr, only: [:confirm]
  skip_before_action :redirect_to_login_if_required, only: [:confirm]

  def index
  end

  def update
    params.require(:phone_number)


    if params[:phone_number] && params[:phone_number].length > 0
      phone_number_record = PhoneNumber.find_by_number(params[:phone_number])
      if phone_number_record.nil?
        return fail_with("login.phone_number_not_match")
      elsif phone_number_record.verified?
        return fail_with("login.phone_number_already_taken")
      elsif !params[:verification_code] || params[:verification_code] != phone_number_record.verification_code
        return fail_with("login.verification_code_not_match")
      end
    end

    if phone_number_record
      phone_number_record.update(user: current_user, verified: true)
    end

    if phone_number_record.errors.present?
      return render_json_error(updater.errors.full_messages)
    end

    render body: nil
  rescue RateLimiter::LimitExceeded
    render_json_error(I18n.t("rate_limiter.slow_down"))
  end

  def confirm
    expires_now
    updater = EmailUpdater.new
    @update_result = updater.confirm(params[:token])

    if @update_result == :complete
      updater.user.user_stat.reset_bounce_score!
      log_on_user(updater.user)
    end

    render layout: 'no_ember'
  end

end
