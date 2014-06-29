FactoryGirl.define do
  sequence :email do |n|
    "email#{n}@factory.com"
  end

  sequence :name do |n|
    "user_#{n}"
  end

  factory :user do
    name
    email
    password 'foobar'
    password_confirmation 'foobar'
  end

  factory :moderator, class: User do
    name
    email
    password 'foobar'
    password_confirmation 'foobar'
    role_id 2
  end

  factory :manager, class: User do
    name
    email
    password 'foobar'
    password_confirmation 'foobar'
    role_id 4
  end
end