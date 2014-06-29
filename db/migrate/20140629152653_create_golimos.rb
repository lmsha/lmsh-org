class CreateGolimos < ActiveRecord::Migration
  def change
    create_table :golimos do |t|

      t.timestamps
    end
  end
end
