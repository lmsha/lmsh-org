class AddColumnToGolimos < ActiveRecord::Migration
  def change
    add_column :golimos, :money, :decimal, default: 0
  end
end
