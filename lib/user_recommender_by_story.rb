class UserRecommenderByStory
  def initialize user#, users
    @user, @users = user, User.all
    @recommended_users = []
  end

  def get_words_of_user_story user
    if user.story_field.nil?
      @words_of_user_story = []
    else
      @words_of_user_story = user.story_field.gsub(/[a-zA-Z]{3,}/).map(&:downcase).uniq.sort
    end

  end

  def recommendations
    @users.each do |this_user|
      this_user.define_singleton_method(:jaccard_index) do @jaccard_index;  end

      this_user.define_singleton_method("jaccard_index=") do |index|
        @jaccard_index = index || 0.0
      end

      intersection = (get_words_of_user_story(@user) & get_words_of_user_story(this_user)).size
      union = (get_words_of_user_story(@user) | get_words_of_user_story(this_user)).size

      this_user.jaccard_index = (intersection.to_f / union.to_f) rescue 0.0
      #if (this_user.jaccard_index >= 0)
      #  @recommended_users.push (this_user)
      #end
      this_user

    end.sort_by { |user| 1 - user.jaccard_index }

  end

  def list_recommendations
    @recommended_users = recommendations
    @recommended_users.each do |user|
      puts "#{user.username} (#{'%.2f' % user.jaccard_index})"
    end.sort_by { |user| 1 - user.jaccard_index }
  end
end



