require_dependency 'topic_list_responder'
require_dependency 'user_list_responder'

class FollowingController < ListController
  include UserListResponder

  def index
  end

  def topics
    @title = I18n.t('js.following.topics.title')
    list_opts = build_topic_list_options
    user = current_user
    list = generate_list_for("topics_followed_by", user, list_opts)
    list.more_topics_url = construct_url_with(:next, list_opts)
    list.prev_topics_url = construct_url_with(:prev, list_opts)
    respond_with_list(list)
  end

  def people
    list_opts = {}
    UserQuery.public_valid_options.each do |key|
      list_opts[key] = params[key]
    end

    # hacky columns get special handling
    list_opts[:slow_platform] = slow_platform?
    user = current_user
    list = UserQuery.new(user, list_opts).public_send("list_following")
    list_latest_posts = []
    list.users.each do |user|
      if user.posts
        list_latest_posts << user.posts.last
        # if posts.last.last_version_at < current_user.last_seen_at
        #
        # end
      end
    end

    list.more_users_url = construct_url_with(:next, list_opts)
    list.prev_users_url = construct_url_with(:prev, list_opts)
    @title = "Following People"
    respond_with_user_list(list)
    # respond_to do |format|
    #   format.html do
    #     render html: '', layout: true
    #   end
    #   format.json do
    #     render_serialized(list_latest_posts, PostSerializer)
    #   end
    # end
  end

  private
  def construct_url_with(action, opts, url_prefix = nil)
    method = url_prefix.blank? ? "following_#{action_name}_path" : "#{url_prefix}_following_#{action_name}_path"
    url = if action == :prev
            public_send(method, opts.merge(prev_page_params(opts)))
          else # :next
            public_send(method, opts.merge(next_page_params(opts)))
          end
    url.sub('.json?', '?')
  end
end


