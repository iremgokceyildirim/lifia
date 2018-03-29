require_dependency 'topic_list_responder'

class FollowingController < ApplicationController
  include TopicListResponder
  skip_before_action :check_xhr

  before_action :ensure_logged_in

  def topics
    @title = I18n.t('js.following.topic.title')
    list_opts = build_topic_list_options
    user = list_target_user
    list = generate_list_for("topics_followed_by", user, list_opts)
    list.more_topics_url = construct_url_with(:next, list_opts)
    list.prev_topics_url = construct_url_with(:prev, list_opts)
    respond_with_list(list)
  end

  def build_topic_list_options
    options = {}
    TopicQuery.public_valid_options.each do |key|
      options[key] = params[key]
    end

    # hacky columns get special handling
    options[:topic_ids] = param_to_integer_list(:topic_ids)
    options[:no_subcategories] = options[:no_subcategories] == 'true'
    options[:slow_platform] = slow_platform?

    options
  end

  def generate_list_for(action, target_user, opts)
    TopicQuery.new(current_user, opts).send("list_#{action}", target_user)
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


