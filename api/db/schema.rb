# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_06_04_032938) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "cases", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "court", null: false
    t.string "case_number", null: false
    t.date "start_date", null: false
    t.date "end_date"
    t.bigint "lawyer_id", null: false
    t.string "client_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["case_number"], name: "index_cases_on_case_number", unique: true
    t.index ["lawyer_id"], name: "index_cases_on_lawyer_id"
  end

  create_table "media", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.bigint "case_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["case_id"], name: "index_media_on_case_id"
    t.index ["user_id"], name: "index_media_on_user_id"
  end

  create_table "notes", force: :cascade do |t|
    t.text "content", null: false
    t.bigint "user_id", null: false
    t.string "notable_type", null: false
    t.bigint "notable_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["notable_type", "notable_id"], name: "index_notes_on_notable"
    t.index ["user_id"], name: "index_notes_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.integer "role", default: 0
    t.string "password_digest"
    t.string "name", null: false
    t.string "second_name"
    t.string "surname", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "cases", "users", column: "lawyer_id"
  add_foreign_key "media", "cases"
  add_foreign_key "media", "users"
  add_foreign_key "notes", "users"
end
