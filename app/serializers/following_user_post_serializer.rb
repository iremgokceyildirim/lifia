class FollowingUserPostSerializer < BasicPostSerializer
  attributes :category_id,
             :url

  has_one :topic, serializer: ListableTopicSerializer, embed: :object

  def category_id
    object.topic.category_id
  end

end
