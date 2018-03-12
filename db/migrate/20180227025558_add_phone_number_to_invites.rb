class AddPhoneNumberToInvites < ActiveRecord::Migration[5.1]
  def change
    add_column :invites, :phone_number, :string, limit: 10
    add_column :invites, :label, :string
  end
end
