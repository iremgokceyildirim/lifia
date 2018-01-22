class UserList
  include ActiveModel::Serialization

  attr_accessor :filter,
                :per_page,
                :current_user,
                :users

  def initialize(filter, current_user, users, opts = nil)
    @filter = filter
    @current_user = current_user
    @users = users
    @opts = opts || {}

  end

  def preload_key
      "user_list_#{@filter}"
  end
end
