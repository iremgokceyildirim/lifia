
class PhoneNumber < ActiveRecord::Base
  belongs_to :user
  attr_accessor :number, :verified
end

# == Schema Information
#
# Table name: phone_numbers
#
#  id                 :integer          not null, primary key
#  user_id            :integer
#  number             :string           not null
#  verification_code  :integer          not null
#  verified           :boolean          default(FALSE), not null
#
# Indexes
#
#  index_phone_numbers_on_user_id_and_number  (user_id,number) UNIQUE
#
