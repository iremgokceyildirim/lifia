class RecommendedUserSerializer < BasicUserSerializer
  attributes :email,
             :last_seen_at,
             :last_emailed_at,
             :created_at,
             :last_seen_age,
             :last_emailed_age,
             :created_at_age,
             :username_lower,
             :trust_level,
             :username,
             :title,
             :avatar_template,
             :time_read

  [:days_visited, :topics_entered, :topic_count, :topic_reply_count, :likes_received, :likes_given].each do |sym|
    attributes sym
    define_method sym do
      object.user_stat.send(sym)
    end
  end

  def last_seen_age
    return nil if object.last_seen_at.blank?
    AgeWords.age_words(Time.now - object.last_seen_at)
  end

  def last_emailed_age
    return nil if object.last_emailed_at.blank?
    AgeWords.age_words(Time.now - object.last_emailed_at)
  end

  def created_at_age
    AgeWords.age_words(Time.now - object.created_at)
  end

  def time_read
    return nil if object.user_stat.time_read.blank?
    AgeWords.age_words(object.user_stat.time_read)
  end
end
