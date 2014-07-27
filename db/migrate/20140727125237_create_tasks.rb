class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.text :description
      t.integer :simple, limit: 1, default: 1
      t.integer :category_id
      t.integer :number
      t.timestamps
    end
  end
end
