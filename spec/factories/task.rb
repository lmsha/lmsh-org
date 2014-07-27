FactoryGirl.define do
  sequence :simple do
    [0,1].sample
  end

  sequence :description do |n|
    "task_desc_#{n}"
  end

  sequence :number do |n|
    n
  end

  sequence :category_id do
    [1,2,3,4,5].sample
  end

  factory :task do
    description
    simple
    form
    category_id
    number
  end

  factory :simple_task do
    description
    simple 1
    form
    category_id
    number
  end

  factory :difficult_task do
    description
    simple 0
    form
    category_id
    number
  end
end