
class PhoneNumber < ActiveRecord::Base
  belongs_to :user
  validates :number,   presence: true, length: {minimum: 10, maximum: 10, too_long: "The length of the phone number should be %{count}",too_short: "The length of the phone number should be %{count}"}
  validates :verification_code, length: {maximum: 6, too_long: "The length of the verification code should be %{count}"}
  attr_accessor :user, :verified

  def generate_code
    self.verification_code = (Random.rand(100000...999999)).to_s
    save
  end

  def send_code
    TwilioSMS.send_verification_sms(self.number, self.verification_code)
  end

  def verify(entered_code)
    update(verified: true) if self.verification_code == entered_code
  end
end

# == Schema Information
#
# Table name: phone_numbers
#
#  id                 :integer          not null, primary key
#  user_id            :integer
#  number             :string           not null
#  verification_code  :string           not null
#  verified           :boolean          default(FALSE), not null
#
# Indexes
#
#  index_phone_numbers_on_user_id_and_number  (user_id,number) UNIQUE
#
