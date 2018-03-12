module Jobs

  # Asynchronously send an sms, keep it for future usages
  class SendSms < Jobs::Base

    def execute(args)
      puts "sending sms..."

      if args[:reason] == "send_invitation"
        raise Discourse::InvalidParameters.new(:invite_id) unless args[:invite_id].present?
        invite = Invite.find_by(id: args[:invite_id])
        message = invite.custom_message
        raise Discourse::InvalidParameters.new(:phone_number) unless invite.phone_number.present?
        to_number = invite.phone_number
      elsif args[:reason] == "send_verification"
        raise Discourse::InvalidParameters.new(:to_number) unless args[:to_number].present?
        message = "Verification code: " + args[:code]
        to_number = args[:to_number]
      end

      TwilioSMS.send_sms(to_number, message)
    end
  end

end
