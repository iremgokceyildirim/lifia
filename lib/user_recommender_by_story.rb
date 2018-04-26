class UserRecommenderByStory

  def initialize (user)
    @current_user = user
    @users = User.where.not(id:@current_user.id)#, admin: true, moderator: true)
    @recommended_users = []
    @similarity_factor = SiteSetting.story_similarity_factor.to_f
  end

  def get_words_of_user_story (user)
    #if user.story_field.nil?
    if user.story.nil?
      @words_of_user_story = []
    else
      @words_of_user_story = user.story.gsub(/[a-zA-Z]{3,}/).map(&:downcase).uniq.sort#user.story_field.gsub(/[a-zA-Z]{3,}/).map(&:downcase).uniq.sort
    end

  end

  def calculate_jaccard_for (user)
    # user.define_singleton_method(:jaccard_index) do @jaccard_index  end
    #
    # user.define_singleton_method("jaccard_index=") do |index|
    #   @jaccard_index = index || 0.0
    # end

    intersection = (get_words_of_user_story(@current_user) & get_words_of_user_story(user)).size
    union = (get_words_of_user_story(@current_user) | get_words_of_user_story(user)).size #TODO:not sure about the later part, we may get the current user's story as basis?
    if union != 0
      jaccard_index = intersection.to_f / union.to_f
    else
      jaccard_index = 0.0
    end

    # user.jaccard_index = jaccard_index
    jaccard_index
  end

  def update_jaccard_for(user, user_s)
    jaccard_index = calculate_jaccard_for (user)
    user_s.index = '%.2f' % jaccard_index
    user_s.recommended_at = DateTime.now
    user_s.save
  end

  def update_similarity
    @users.each do |this_user|
      user_s = UserNarrativeSimilarity.where(user1_id: @current_user.id, user2_id: this_user.id).or(UserNarrativeSimilarity.where(user2_id: @current_user.id, user1_id: this_user.id)).first

      if user_s
        if this_user.story_updated_at && (this_user.story_updated_at > user_s.recommended_at)
          update_jaccard_for(this_user, user_s)
        end
      else
        user_s = UserNarrativeSimilarity.create(user1_id:@current_user.id, user2_id:this_user.id)
        update_jaccard_for(this_user, user_s)
      end

    end
  end

  def recommended_users
    @recommended_users = []
    user_s = UserNarrativeSimilarity.where("user1_id = ? AND index >= ?", @current_user.id, @similarity_factor).or(UserNarrativeSimilarity.where("user2_id = ? AND index >= ?", @current_user.id, @similarity_factor)).order(index: :desc)

    user_s.each do |u_s|
      if u_s.user1 == @current_user
        @recommended_users << u_s.user2
      else
        @recommended_users << u_s.user1
      end
    end
    @recommended_users
  end

end



