require_dependency 'user_list'


class UserQuery
  def self.public_valid_options
    @public_valid_options ||=
      %i(user_ids
         order
         )
  end

  def self.valid_options
    @valid_options ||=
      public_valid_options +
        %i(except_user_ids
         limit
         page
         per_page
         visible
         no_definitions)
  end

  # Maps `order` to a columns in `users`
  SORTABLE_MAPPING = {
    'name' => 'name',
    'username' => 'username'
  }

  cattr_accessor :results_filter_callbacks
  self.results_filter_callbacks = []

  attr_accessor :options, :user, :guardian

  def self.add_custom_filter(key, &blk)
    @custom_filters ||= {}
    valid_options << key
    public_valid_options << key
    @custom_filters[key] = blk
  end

  def self.remove_custom_filter(key)
    @custom_filters.delete(key)
    public_valid_options.delete(key)
    valid_options.delete(key)
    @custom_filters = nil if @custom_filters.length == 0
  end

  def self.apply_custom_filters(results, user_query)
    if @custom_filters
      @custom_filters.each do |key, filter|
        results = filter.call(results, user_query)
      end
    end
    results
  end

  def initialize(user = nil, options = {})
    @options = options.dup
    @user = user
    @guardian = Guardian.new(@user)
  end

  def list_recommended
    create_list(:recommended, {}, recommended_results)
  end

  def recommended_results(options = {})
    recommender = UserRecommenderByStory.new(@user)
    recommender.update_similarity
    result = recommender.recommended_users
    result
  end

  def create_list(filter, options = {}, users = nil)
    list = UserList.new(filter, @user, users, options.merge(@options))
    list.per_page = per_page_setting
    list
  end

  protected

  def per_page_setting
    @options[:slow_platform] ? 15 : 30
  end

end
