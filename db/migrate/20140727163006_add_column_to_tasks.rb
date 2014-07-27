class AddColumnToTasks < ActiveRecord::Migration
  def change
    add_column :tasks, :form, :integer
  end
end
