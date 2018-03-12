class InvitationCode < ActiveRecord::Base
  include ActiveModel::Serialization

  belongs_to :owner_user, class_name: 'User'
  belongs_to :sent_user, class_name: 'User'


  validates :owner_user_id, presence: true
  validates :code, presence: true, length: {minimum: 6, maximum: 6, too_long: "The length of the code should be %{count}",too_short: "The length of the code should be %{count}"}

  def self.invitation_code_exist?(code)
    if InvitationCode.where(code: code).size > 0
      return true
    else
      return false
    end
  end

  def self.used_invitation_code?(code)
    invitation = InvitationCode.where(code: code).take
    if !invitation.nil?
      if !invitation.sent_user.nil?
        return true
      else
        return false
      end
    end

    return false
  end

  def self.generate_code
    code_generated = SecureRandom.hex(3)
    invitation_code_list = InvitationCode.select(:code).map(&:code)
    while invitation_code_list.include?(code_generated)
      code_generated = SecureRandom.hex(3)
    end

    self.code = code_generated
  end

  def expired?
    created_at < SiteSetting.invite_expiry_days.days.ago
  end
end


# == Schema Information
#
# Table name: invitation_codes
#
#  id                 :integer          not null, primary key
#  owner_user_id      :integer          not null
#  sent_user_id       :integer
#  code               :string           not null
#  isSent             :boolean          default(FALSE), not null
#  isUsed             :boolean          default(FALSE), not null
#  sent_at            :timestamp
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_invitation_codes_on_owner_user_id_and_code  (user_id,code) UNIQUE
#
