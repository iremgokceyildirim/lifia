require_dependency 'user_list'
require_dependency 'trust_level'
require_dependency 'user_recommender_by_story'


class UserQuery
  def self.public_valid_options
    @public_valid_options ||=
      %i(page
         order
         ascending
         slow_platform)
  end

  def self.valid_options
    @valid_options ||=
      public_valid_options +
        %i(limit
         page
         per_page)
  end


  def initialize(user = nil, options = {}, klass = User, trust_levels = TrustLevel.levels)
    @options = options
    @user = user
    @query = initialize_query_with_order(klass.joins(:primary_email))
    @trust_levels = trust_levels
  end

  attr_reader :options, :trust_levels

  SORTABLE_MAPPING = {
    'created' => 'created_at',
    'last_emailed' => "COALESCE(last_emailed_at, to_date('1970-01-01', 'YYYY-MM-DD'))",
    'seen' => "COALESCE(last_seen_at, to_date('1970-01-01', 'YYYY-MM-DD'))",
    'username' => 'username',
    'email' => 'email',
    'trust_level' => 'trust_level',
    'days_visited' => 'user_stats.days_visited',
    'posts_read' => 'user_stats.posts_read_count',
    'topics_viewed' => 'user_stats.topics_entered',
    'posts' => 'user_stats.post_count',
    'read_time' => 'user_stats.time_read'
  }

  def find_users(limit = 100)
    page = params[:page].to_i - 1
    if page < 0
      page = 0
    end
    find_users_query.limit(limit).offset(page * limit)
  end

  def count_users
    find_users_query.count
  end

  def custom_direction
    asc = params[:ascending]
    asc.present? && asc ? "ASC" : "DESC"
  end

  def initialize_query_with_order(klass)
    order = []

    custom_order = options[:order]
    if custom_order.present? &&
      without_dir = SORTABLE_MAPPING[custom_order.downcase.sub(/ (asc|desc)$/, '')]
      order << "#{without_dir} #{custom_direction}"
    end

    if !custom_order.present?
      if options[:query] == "active"
        order << "COALESCE(users.last_seen_at, to_date('1970-01-01', 'YYYY-MM-DD')) DESC"
      else
        order << "users.created_at DESC"
      end

      order << "users.username"
    end

    if options[:stats].present? && options[:stats] == false
      klass.order(order.reject(&:blank?).join(","))
    else
      klass.includes(:user_stat).order(order.reject(&:blank?).join(","))
    end
  end

  def filter_by_trust
    levels = trust_levels.map { |key, _| key.to_s }
    if levels.include?(params[:query])
      @query.where('trust_level = ?', trust_levels[params[:query].to_sym])
    end
  end

  def suspect_users
    where_conds = []

    # One signal: no reading yet the user has bio text
    where_conds << "user_stats.posts_read_count <= 1 AND user_stats.topics_entered <= 1"

    @query.activated
      .human_users
      .references(:user_stats)
      .includes(:user_profile)
      .where("COALESCE(user_profiles.bio_raw, '') != ''")
      .where('users.created_at <= ?', 1.day.ago)
      .where(where_conds.map { |c| "(#{c})" }.join(" OR "))
  end

  def filter_by_search
    if params[:filter].present?
      params[:filter].strip!
      if ip = IPAddr.new(params[:filter]) rescue nil
        @query.where('ip_address <<= :ip OR registration_ip_address <<= :ip', ip: ip.to_cidr_s)
      else
        @query.where('username_lower ILIKE :filter OR user_emails.email ILIKE :filter', filter: "%#{params[:filter]}%")
      end
    end
  end

  def filter_exclude
    if params[:exclude].present?
      @query.where('users.id != ?', params[:exclude])
    end
  end

  # this might not be needed in rails 4 ?
  def append(active_relation)
    @query = active_relation if active_relation
  end

  def find_users_query
    append filter_by_trust
    append filter_exclude
    append filter_by_search
    @query
  end

  def self.public_valid_options
    @public_valid_options ||=
      %i(page
         before
         order
         ascending
         filter
         search
         q
         slow_platform)
  end

  def list_recommended
    create_list(:recommended, {}, recommended_results)
  end

  def list_following
    create_list(:following, {}, following_results)
  end

  def recommended_results
    recommender = UserRecommenderByStory.new(@user)
    #recommender.update_similarity
    result = recommender.recommended_users
    result
  end

  def following_results
    result = @user.followees
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
