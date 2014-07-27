class CreateAssignments < ActiveRecord::Migration
  def change
    create_table :assignments do |t|
      t.references :golimo
      t.references :task
      t.integer :team
      t.integer :score
      t.integer :time_spent #in seconds
      t.timestamps
    end
  end
end
