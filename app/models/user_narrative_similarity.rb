class UserNarrativeSimilarity < ActiveRecord::Base
  belongs_to :user1, class_name: 'User', dependent: :destroy
  belongs_to :user2, class_name: 'User', dependent: :destroy

  validate :validate_users_are_unique, on: :create

  private

  def validate_users_are_unique
    if self.class.where(user1_id: user1.id, user2_id: user2.id)
         .or(self.class.where(user1_id: user2.id, user2_id: user1.id))
         .exists?
      errors.add(:base, 'User 1 and User 2 combination exists!')
    end
  end
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
