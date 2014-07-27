FactoryGirl.define do
  sequence :name do 
    Faker::Name.first_name
  end

  sequence :last_name do
    Faker::Name.last_name
  end

  sequence :team do
    [1,2,3,4].sample
  end

  sequence :gender do
    [0,1].sample
  end

  sequence :form do
    [7,8,9,10].sample
  end

  sequence :city do
    ['Москва', 'Тула', 'Ефремов'].sample
  end

  factory :golimo do
    name 
    last_name
    team 
    gender 
    form 
    city 
  end
end