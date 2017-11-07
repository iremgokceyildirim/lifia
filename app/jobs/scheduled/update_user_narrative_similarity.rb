module Jobs
  class UpdateUserNarrativeSimilarity < Jobs::Scheduled
    every 10.minutes

    def execute(args)
      if(args[:user].nil?)
        users = User.all
        users.each do |user|
          UserRecommenderByStory.new(user).update_similarity
        end
      else
        UserRecommenderByStory.new(args[:user]).update_similarity
      end
    end

  end
end
