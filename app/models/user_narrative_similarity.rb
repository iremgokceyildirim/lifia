class UserNarrativeSimilarity < ActiveRecord::Base
  belongs_to :user1, class_name: 'User'
  belongs_to :user2, class_name: 'User'
end


# == Schema Information
#
# Table name: user_narrative_similarities
#
#  id                   :integer          not null, primary key
#  user1                :integer          not null
#  user2                :integer          not null
#  index                :float            not null
#  user1_checked_user2  :boolean          not null
#  user2_checked_user1  :boolean          not null
#  recommended_at       :datetime         not null
#
