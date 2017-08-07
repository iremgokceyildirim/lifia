class Library
  include ActiveModel::Serialization

  attr_accessor :moderators,
                :admins

  def title
    SiteSetting.title
  end

  def description
    #SiteSetting.site_description
    "One of the largest and most authoritative collections of online journals, books, and research resources, covering life, health, social, and physical sciences."
  end

  def locale
    SiteSetting.default_locale
  end

  def https
    SiteSetting.force_https
  end

  def version
    Discourse::VERSION::STRING
  end

end
