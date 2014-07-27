class AddColumnToAssignments < ActiveRecord::Migration
  def change
    add_column :assignments, :complete, :integer, limit: 1, default: 0
  end
end
