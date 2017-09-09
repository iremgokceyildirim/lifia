module Jobs

  # Asynchronously send an email
  class SendSMS < Jobs::Base

    sidekiq_options queue: 'critical'

    def verify(args)
      print "aydin**********************"
      raise Discourse::InvalidParameters.new(:to_number) unless args[:to_number].present?

      #message = TestMailer.send_test(args[:to_address]) //verification code
      TwilioNotifications.send_verification_sms(args[:to_number])
    end

  end

end
