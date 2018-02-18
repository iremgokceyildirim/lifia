class CreatePhoneNumbers < ActiveRecord::Migration[4.2]
  def change
    create_table :phone_numbers do |t|
      t.integer :user_id, null: true
      t.string :verification_code, limit: 6, null: true
      t.string :number, limit: 10, null: false
      t.boolean :verified, default: false, null: false
    end

    add_index :phone_numbers, [:user_id, :number], unique: true
  end
end
