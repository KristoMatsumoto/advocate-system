class MakeMediumPolymorphic < ActiveRecord::Migration[7.1]
  # In a good way, it is necessary to add the migration 
  # of Note -> Medium, but since these data could only 
  # be entered from the console to this migration, 
  # this does not make any sense
  def up
    add_reference :media, :mediable, polymorphic: true, null: true

    Medium.where.not(case_id: nil).find_each do |medium|
      medium.update_columns(
        mediable_id: medium.case_id,
        mediable_type: "Case"
      )
    end

    change_column_null :media, :title, true
    change_column_null :media, :mediable_id, false
    change_column_null :media, :mediable_type, false
    remove_reference :media, :case, foreign_key: true

    drop_table :notes do |t|
      t.text :content, null: false
      t.references :user, null: false, foreign_key: true
      t.references :notable, polymorphic: true, null: false
      t.timestamps
    end
  end

  def down
    add_reference :media, :case, foreign_key: true

    Medium.where(mediable_type: "Case").find_each do |medium|
      medium.update_columns(case_id: medium.mediable_id)
    end

    Medium.where(title: nil).update_all(title: "Title")
    change_column_null :media, :title, false
    remove_reference :media, :mediable, polymorphic: true

    create_table :notes do |t|
      t.text :content, null: false
      t.references :user, null: false, foreign_key: true
      t.references :notable, polymorphic: true, null: false
      t.timestamps
    end
  end
end
