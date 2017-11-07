class UserNarrativeSimilaritySerializer < ApplicationSerializer
  attributes :user1_id, :user2_id, :index, :user1_checked, :user2_checked, :recommended_at

  has_one :user_1, embed: :object, serializer: UserSerializer
  has_one :user_2, embed: :object, serializer: UserSerializer


  def refresh_similarities
    Jobs::UpdateUserNarrativeSimilarity.new.execute({})
  end

  #def refresh_similarities_for user
  #  Jobs::UpdateUserNarrativeSimilarity.new.execute({user: user})
  #end
end
