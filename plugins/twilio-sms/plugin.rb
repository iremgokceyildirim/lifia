# name: twilio-sms
# about: SMS plugin for Discourse
# version: 0.0.1
# authors: Irem Gokce Yildirim
# url: https://github.com/scossar/twilio-notifications


PLUGIN_NAME ||= "Twilio SMS".freeze

gem 'twilio-ruby', '4.9.0'

enabled_site_setting :twilio_sms_enabled

after_initialize do
  module ::TwilioSMS
    def self.account_sid
      SiteSetting.twilio_sms_account_sid
    end

    def self.auth_token
      SiteSetting.twilio_sms_auth_token
    end

    def self.twilio_phone_number
      "+#{SiteSetting.twilio_sms_phone_number}"
    end

    def self.send_sms (number, message) #e.g. number:1111111111, code:111111
      puts number
      puts message
      client = Twilio::REST::Client.new account_sid, auth_token

      client.account.messages.create(
        :from => twilio_phone_number,
        :to => "+1#{number}",
        :body => "#{message}"
      )
    end
  end
end


