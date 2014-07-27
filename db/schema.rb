# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140727164348) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "assignments", force: true do |t|
    t.integer  "golimo_id"
    t.integer  "task_id"
    t.integer  "team"
    t.integer  "score"
    t.integer  "time_spent"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "complete",   limit: 2, default: 0
  end

  create_table "golimos", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.string   "last_name"
    t.integer  "team"
    t.integer  "gender",     limit: 2
    t.date     "birthday"
    t.string   "city"
    t.integer  "form"
    t.decimal  "money",                default: 0.0
  end

  create_table "tasks", force: true do |t|
    t.text     "description"
    t.integer  "simple",      limit: 2, default: 1
    t.integer  "category_id"
    t.integer  "number"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "form"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email",                                    null: false
    t.string   "crypted_password",                         null: false
    t.string   "salt",                                     null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "role_id",                      default: 1
    t.string   "remember_me_token"
    t.datetime "remember_me_token_expires_at"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["remember_me_token"], name: "index_users_on_remember_me_token", where: "(remember_me_token IS NOT NULL)", using: :btree

end
