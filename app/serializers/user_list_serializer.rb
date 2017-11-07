class UserListSerializer < ApplicationSerializer

  attributes :per_page

  has_many :users, serializer: UserSerializer, embed: :objects

  def users
    object.users ||= []
  end
end
