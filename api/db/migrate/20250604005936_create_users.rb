class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :email, null: false, index: { unique: true }
      t.integer :role, default: 0 # 0 - 'lawyer', 1 - 'secretary'
      t.string :password_digest
      t.string :name, null: false
      t.string :second_name
      t.string :surname, null: false

      t.timestamps
    end
  end
end
