namespace :seedcsv do
  desc "Populate DB from CSV file"

  task golimos: :environment do
    require 'csv'    
    
    csv_text = File.read Rails.root.join('golimos.csv')
    csv = CSV.parse(csv_text, :headers => true)
    csv.each do |row|
      Golimo.create!(row.to_hash)
    end
  end
end
