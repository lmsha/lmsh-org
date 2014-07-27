class DropTables < ActiveRecord::Migration
  def change
    drop_table :courses
    drop_table :events
    drop_table :teachers
  end
end
