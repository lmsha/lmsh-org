source 'https://rubygems.org'


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.1.2'

gem 'pg'

gem 'redis-rails'

# https://github.com/NoamB/sorcery
gem "sorcery" #, 

#https://github.com/thoughtbot/paperclip
gem "paperclip", "~> 3.0"

#https://github.com/jejacks0n/navigasmic
git 'git://github.com/palkan/navigasmic.git', :branch => "feature-item-generator" do
  gem 'navigasmic'
end

gem 'draper', '~> 1.3'

#https://github.com/elabs/pundit
gem "pundit"

# Assets proccessing
gem "slim-rails"
gem 'sass-rails', '~>4.0.0'
gem 'coffee-rails', '~>4.0.0'
gem 'uglifier', '>= 1.0.3'
gem 'rails-sass-images'
gem 'autoprefixer-rails'
gem "csso-rails"
gem "font-awesome-rails"
gem 'skim'

git 'git://github.com/palkan/evil-front.git', :branch => "fix-rails-helpers" do 
  gem 'evil-front'
end

gem 'puma'

group :development, :test do  
  gem "rspec", "~> 2.14.0"
  gem 'rspec-rails', "~> 2.14.0"
  gem "factory_girl_rails", "~> 4.0"
  gem 'capybara'  
  gem 'json_spec'
  gem 'database_cleaner'
  gem 'faker'
end

gem 'pry-byebug', group: [:development, :test]

group :development do
  gem 'capistrano'
  gem 'capistrano-rails'
  gem 'capistrano-bundler'  
end