class AddStoryToTopics < ActiveRecord::Migration
  def change
    add_column :topics, :story, :boolean, default: false
  end
end
