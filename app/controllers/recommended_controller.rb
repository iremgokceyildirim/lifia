require_dependency 'user_list_responder'
require_dependency 'user_query'

class RecommendedController < ApplicationController
  include UserListResponder

  skip_before_action :check_xhr

  before_action :ensure_logged_in

  def topics
    @title = I18n.t('js.recommended.topics.title') #TODO: add locale
    story_topic = current_user.story_topic
    @topic_view = TopicView.new(story_topic.id, current_user)
    respond_to do |format|
      format.html do
        #store_preloaded(list.preload_key, MultiJson.dump(TopicViewSerializer.new(@topic_view, scope: scope, root: false)))
        render 'recommended/topics'
      end
      format.json do
        render_serialized(@topic_view, TopicViewSerializer)
      end
    end
  end

  def categories
    @title = I18n.t('js.recommended.categories.title') #TODO: add locale
    story_topic = current_user.story_topic
    categories = []
    suggested_topics = TopicQuery.new(current_user).list_suggested_for(story_topic)
    if suggested_topics.topics
      suggested_topics.topics.each do |t|
        if categories.include?(t.category)
        else
          categories << t.category
        end
      end
    end

    category_options = {
      is_homepage: current_homepage == "categories".freeze,
      parent_category_id: params[:parent_category_id],
      include_topics: false
    }

    result = CategoryList.new(guardian, category_options)
    result.draft_key = Draft::NEW_TOPIC
    result.draft_sequence = DraftSequence.current(current_user, Draft::NEW_TOPIC)
    result.draft = Draft.get(current_user, Draft::NEW_TOPIC, result.draft_sequence) if current_user

    result.categories = categories

    respond_to do |format|
      format.html do
        #store_preloaded(list.preload_key, MultiJson.dump(TopicViewSerializer.new(@topic_view, scope: scope, root: false)))
        render 'recommended/topics'
      end
      format.json do
        render_serialized(result, CategoryListSerializer)
      end
    end
  end

  def people
    list_opts = build_recommended_list_options
    user = list_target_user
    list = UserQuery.new(user, list_opts).public_send("list_recommended")
    #list.more_users_url = construct_url_with(:next, list_opts)
    #list.prev_users_url = construct_url_with(:prev, list_opts)
    @title = I18n.t("js.recommended.people.title", count: 0)
    #render_serialized(list, UserListSerializer)
    respond_with_user_list(list, {is_recommended: true})

  end

  def build_recommended_list_options
    options = {}
    UserQuery.public_valid_options.each do |key|
      options[key] = params[key]
    end

    # hacky columns get special handling
    options[:slow_platform] = slow_platform?
    options[:is_recommended] = true

    options
  end

  protected

  def next_page_params(opts = nil)
    page_params(opts).merge(page: params[:page].to_i + 1)
  end

  def prev_page_params(opts = nil)
    pg = params[:page].to_i
    if pg > 1
      page_params(opts).merge(page: pg - 1)
    else
      page_params(opts).merge(page: nil)
    end
  end

  private

  def page_params(opts = nil)
    opts ||= {}
    route_params = { format: 'json' }
    route_params[:order]           = opts[:order]                           if opts[:order].present?
    route_params[:ascending]       = opts[:ascending]                       if opts[:ascending].present?
    route_params
  end

  def list_target_user
    if params[:user_id] && guardian.is_staff?
      User.find(params[:user_id].to_i)
    else
      current_user
    end
  end

  def construct_url_with(action, opts, url_prefix = nil)
    method = url_prefix.blank? ? "#{action_name}_path" : "#{url_prefix}_#{action_name}_path"
    url = if action == :prev
            public_send(method, opts.merge(prev_page_params(opts)))
          else # :next
            public_send(method, opts.merge(next_page_params(opts)))
          end
    url.sub('.json?', '?')
  end

end

