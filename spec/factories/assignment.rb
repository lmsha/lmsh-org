FactoryGirl.define do
  factory :assignment do
    association :task
    association :golimo
  end
end