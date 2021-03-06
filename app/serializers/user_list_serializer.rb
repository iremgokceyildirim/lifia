class UserListSerializer < ApplicationSerializer

  attributes :more_users_url,
             :per_page,
             :users

  #has_many :users, serializer: BasicUserSerializer, embed: :objects


  def include_more_users_url?
    object.more_users_url.present? && (object.users.size == object.per_page)
  end

  def users
    object.users.map{|user|
      if @options[:is_recommended]
        RecommendedUserSerializer.new(user, root: false, scope: scope).as_json
      elsif @options[:is_following]
        FollowingUserSerializer.new(user, root: false, scope: scope).as_json
      else
        BasicUserSerializer.new(user, root: false).as_json
      end
    }
  end

  # attributes :email,
  #            :active,
  #            :admin,
  #            :moderator,
  #            :last_seen_at,
  #            :last_emailed_at,
  #            :created_at,
  #            :last_seen_age,
  #            :last_emailed_age,
  #            :created_at_age,
  #            :username_lower,
  #            :trust_level,
  #            :trust_level_locked,
  #            :flag_level,
  #            :username,
  #            :title,
  #            :avatar_template,
  #            :approved,
  #            :blocked,
  #            :time_read,
  #            :staged,
  #            :latest_post
  #
  # [:days_visited, :topics_entered, :topic_count, :topic_reply_count, :likes_received, :likes_given].each do |sym|
  #   attributes sym
  #   define_method sym do
  #     object.user_stat.send(sym)
  #   end
  # end
  #
  # def latest_post
  #   if object.posts
  #     puts "irem"
  #     puts scope
  #     PostSerializer.new(object.posts.last, scope: scope, root: false, add_title: true).as_json
  #   end
  # end
  #
  # def last_seen_age
  #   return nil if object.last_seen_at.blank?
  #   AgeWords.age_words(Time.now - object.last_seen_at)
  # end
  #
  # def last_emailed_age
  #   return nil if object.last_emailed_at.blank?
  #   AgeWords.age_words(Time.now - object.last_emailed_at)
  # end
  #
  # def created_at_age
  #   AgeWords.age_words(Time.now - object.created_at)
  # end
  #
  # def time_read
  #   return nil if object.user_stat.time_read.blank?
  #   AgeWords.age_words(object.user_stat.time_read)
  # end
end
