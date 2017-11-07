class UserRecommenderByStory

  def initialize user
    @current_user = user
    @users = User.where.not(id:@current_user.id)
    @recommended_users = []
    @users_with_similarities = []
    @similarity_factor = 0.5
  end

  def get_words_of_user_story user
    if user.story_field.nil?
      @words_of_user_story = []
    else
      @words_of_user_story = user.story_field.gsub(/[a-zA-Z]{3,}/).map(&:downcase).uniq.sort
    end

  end

  def get_users_with_similarity
    @users.each do |this_user|
      this_user.define_singleton_method(:jaccard_index) do @jaccard_index  end

      this_user.define_singleton_method("jaccard_index=") do |index|
        @jaccard_index = index || 0.0
      end

      intersection = (get_words_of_user_story(@current_user) & get_words_of_user_story(this_user)).size
      union = (get_words_of_user_story(@current_user) | get_words_of_user_story(this_user)).size

      this_user.jaccard_index = (intersection.to_f / union.to_f) rescue 0.0
      puts this_user.jaccard_index
      this_user
    end.sort_by { |user| 1 - user.jaccard_index }
  end

  def update_similarity
    @users_with_similarities = get_users_with_similarity
    @users_with_similarities.each do |u|
      if @current_user.id != u.id
        puts "#{u.username} (#{'%.2f' % u.jaccard_index})"
        user_s = UserNarrativeSimilarity.find_by(user1_id:@current_user.id, user2_id:u.id)
        if user_s.nil?
          user_s = UserNarrativeSimilarity.find_or_create_by(user1_id:u.id, user2_id:@current_user.id)
        end
        user_s.index = '%.2f' % u.jaccard_index
        user_s.recommended_at = DateTime.now
        user_s.save
      end
    end
  end

  def recommended_users
    if @users_with_similarities.nil?
      @users_with_similarities = get_users_with_similarity
    end
    @recommended_users = @users_with_similarities.select { |u| u.jaccard_index >= @similarity_factor }
    @recommended_users
  end

end



