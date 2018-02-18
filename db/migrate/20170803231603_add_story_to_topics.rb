class AddStoryToTopics < ActiveRecord::Migration[4.2]
  def change
    add_column :topics, :story, :boolean, default: false
  end
end
