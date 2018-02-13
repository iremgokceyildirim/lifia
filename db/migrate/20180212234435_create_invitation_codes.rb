class CreateInvitationCodes < ActiveRecord::Migration[5.1]
  def up
    create_table :invitation_codes do |t|
      t.integer :user_id, null: false
      t.integer :sent_user_id, null: true
      t.string :code, limit: 5, null: false
      t.boolean :isSent, default: false, null: false
      t.boolean :isUsed, default: false, null: false
      t.datetime :sent_at, default: DateTime.now, null: false
      t.timestamps null: false
    end
  end
  def down
    drop_table :invitation_codes
  end
end
