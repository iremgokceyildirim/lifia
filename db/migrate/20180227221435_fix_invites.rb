class FixInvites < ActiveRecord::Migration[5.1]
  def change
    remove_index :invites, [:email, :invited_by_id]
    remove_column :invites, :email
    add_column :invites, :email, :string
  end
end
