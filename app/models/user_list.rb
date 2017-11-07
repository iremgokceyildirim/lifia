class UserList
  include ActiveModel::Serialization

  attr_accessor :more_users_url,
                :prev_users_url,
                :filter,
                :per_page,
                :current_user,
                :users

  def initialize(filter, current_user, users, opts = nil)
    @filter = filter
    @current_user = current_user
    @users = users
    @opts = opts || {}

  end

  # Lazy initialization
  def users
    @users ||= []
    puts @users.size
  end

  # def load_similar_users
  #   @users_similarities.each do |user_pair|
  #     if user_pair.user_1 == @current_user
  #       @similar_users << user_pair.user_2
  #     else
  #       @similar_users << user_pair.user_1
  #     end
  #
  #   UserList.preload(@similar_users, self)
  #
  #   @similar_users
  #   end
  # end


  def preload_key
      "user_list_#{@filter}"
  end


  def attributes
    { 'more_users_url' => page }
  end
end
