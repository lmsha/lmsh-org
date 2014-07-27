namespace :populate do
  desc "Populate DB with data"

  task users: :environment do
    count = 10

    count.times do
      FactoryGirl.create(:user, role_id: [1,2].sample)
    end 
  end

  task golimos: :environment do
    count = 50
    count.times do
      FactoryGirl.create(:golimo, money: BigDecimal(30))      
    end 
  end

  task tasks: :environment do
    count = 50
    count.times do
      FactoryGirl.create(:task)      
    end 
  end

end
