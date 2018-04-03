
class FollowingUser < ActiveRecord::Base
  belongs_to :followee_user, class_name: 'User'
  belongs_to :follower_user, class_name: 'User'
end

# == Schema Information
#
# Table name: following_users
#
#  id                 :integer      not null, primary key
#  follower_user_id   :integer      not null
#  followee_user_id   :integer      not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_following_users_on_followee_user_id_and_follower_user_id  (followee_user_id,follower_user_id) UNIQUE
#  index_following_users_on_follower_user_id_and_followee_user_id  (follower_user_id,followee_user_id) UNIQUE
#
