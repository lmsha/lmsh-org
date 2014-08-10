class ChangeColumnAssignmentsScore < ActiveRecord::Migration
  def change
    change_column :assignments, :score, :decimal
  end
end
