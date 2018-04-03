class CreateFollowingUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :following_users do |t|
      t.column :followee_user_id, :integer, null: false
      t.column :follower_user_id, :integer, null: false
      t.column :notification_level, :integer, null: false
      t.datetime :updated_at
      t.timestamps null: false
    end

    add_index :following_users, [:followee_user_id, :follower_user_id], unique: true
    add_index :following_users, [:follower_user_id, :followee_user_id], unique: true
  end
end
