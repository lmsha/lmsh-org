namespace :exportcsv do
  desc "Export Golimo data to CSV file"

  task golimos: :environment do
    require 'csv'    



    CSV.open("golimos_#{DateTime.now.strftime('%Y%m%d')}.csv", "w") do |csv|
      csv << ["имя", "фамилия", "отряд", "класс", "остаток", "решено задач", "решено сложных", "мат", "физ", "био", "хим", "гум" ]
      Golimo.all.each do |g|
        g = GolimoDecorator.new(g)
        csv << [g.name, g.last_name, g.team, g.form, g.money.to_f, g.tasks_solved, g.tasks_diff, g.tasks_by_category(1), g.tasks_by_category(2), g.tasks_by_category(3), g.tasks_by_category(4), g.tasks_by_category(5)]
      end   
    end
  end
end
