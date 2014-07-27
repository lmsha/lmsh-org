class AddColumnsToGolimos < ActiveRecord::Migration
  def change
    add_column :golimos, :name, :string
    add_column :golimos, :last_name, :string
    add_column :golimos, :team, :integer
    add_column :golimos, :gender, :integer, limit: 1
    add_column :golimos, :birthday, :date
    add_column :golimos, :city, :string
    add_column :golimos, :form, :integer
  end
end
