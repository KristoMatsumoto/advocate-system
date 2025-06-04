class CreateCases < ActiveRecord::Migration[7.1]
  def change
    create_table :cases do |t|
      t.string :title
      t.text :description
      t.string :court, null: false
      t.string :case_number, null: false, index: { unique: true }
      t.date :start_date, null: false
      t.date :end_date
      t.references :lawyer, null: false, foreign_key: { to_table: :users }
      t.string :client_name, null: false

      t.timestamps
    end
  end
end
