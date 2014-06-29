require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Lmsh
  class Application < Rails::Application
    config.encoding = "utf-8"
    config.time_zone = 'Moscow'

    config.assets.paths << Rails.root.join("lib", "assets")
       
    # add all upper level assets 
    config.assets.precompile +=
    Dir[Rails.root.join('app/assets/*/*.{js,css,coffee,sass,scss}*')].
    map { |i| File.basename(i).sub(/(\.js)?\.coffee$/, '.js') }.
    map { |i| File.basename(i).sub(/(\.css)?\.(sass|scss)$/, '.css') }.
    reject { |i| i =~ /^application\.(js|css)$/ }
    
    config.i18n.enforce_available_locales = false
    config.autoload_paths += %W(#{config.root}/lib)
    config.generators do |g|
      g.assets false
      g.helper false
      g.test_framework false
    end
  end
end
