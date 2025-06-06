class CreateNotes < ActiveRecord::Migration[7.1]
  def change
    create_table :notes do |t|
      t.text :content, null: false
      t.references :user, null: false, foreign_key: true
      t.references :notable, polymorphic: true, null: false

      t.timestamps
    end
  end
end
