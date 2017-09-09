PLUGIN_NAME ||= "twilio notifications".freeze

after_initialize do
  module ::TwilioNotifications
    def self.account_sid
      SiteSetting.twilio_notifications_account_sid
    end

    def self.auth_token
      SiteSetting.twilio_notifications_auth_token
    end

    def self.twilio_phone_number
      "+#{SiteSetting.twilio_notifications_phone_number}"
    end

    def self.send_verification_sms (number)
      client = Twilio::REST::Client.new account_sid, auth_token

      client.account.sms.messages.create(
        :from => twilio_phone_number,
        :to => number,
        :body => "Verification Code"
      )
    end
  end
end


