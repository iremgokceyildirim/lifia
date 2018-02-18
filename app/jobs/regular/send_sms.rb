module Jobs

  # Asynchronously send an email, keep it for future usages
  class SendSMS < Jobs::Base

    sidekiq_options queue: 'critical'

    def verify(args)
      print "sending verification code..."
      raise Discourse::InvalidParameters.new(:to_number) unless args[:to_number].present?

      #message = TestMailer.send_test(args[:to_address]) //verification code
      TwilioSMS.send_verification_sms(args[:to_number], args[:code])
    end

  end

end
