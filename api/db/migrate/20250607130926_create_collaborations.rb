class CreateCollaborations < ActiveRecord::Migration[7.0]
  def change
    create_table :collaborations do |t|
      t.references :case, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    add_index :collaborations, [:case_id, :user_id], unique: true
  end
end
