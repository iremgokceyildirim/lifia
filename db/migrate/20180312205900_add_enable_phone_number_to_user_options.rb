class AddEnablePhoneNumberToUserOptions < ActiveRecord::Migration[5.1]
  def change
    add_column :user_options, :enable_phone_number, :boolean, null: false, default: false
  end
end
