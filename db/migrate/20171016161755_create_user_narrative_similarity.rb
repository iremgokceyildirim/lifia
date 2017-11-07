class CreateUserNarrativeSimilarity < ActiveRecord::Migration[5.1]
  def up
    create_table :user_narrative_similarities do |t|
      t.integer :user1_id, null: false
      t.integer :user2_id, null: false
      t.float :index, default: 0.0, :precision => 3, :scale => 2, null: false
      t.boolean :user1_checked_user2, default: false, null: false
      t.boolean :user2_checked_user1, default: false, null: false
      t.datetime :recommended_at, default: DateTime.now, null: false
      t.timestamps null: false
    end

    add_index :user_narrative_similarities, [:user1_id, :user2_id], unique: true
  end

  def down
    drop_table :user_narrative_similarities
  end
end
