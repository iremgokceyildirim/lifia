class UserListSerializer < ApplicationSerializer

  attributes :filter,
             :per_page,
             :current_user,
             :users

  # def users
  #   object.users ||= []
  # end
end
