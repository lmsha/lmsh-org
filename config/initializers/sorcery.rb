Rails.application.config.sorcery.submodules = [:remember_me, :reset_password, :session_timeout]

Rails.application.config.sorcery.after_logout << :logout_account!

Rails.application.config.sorcery.configure do |config|

  # -- external --
  # config.external_providers = [:dpo]

 #add this file to .gitignore BEFORE putting any secret keys in here, or use a system like Figaro to abstract it!!! 

 # config.dpo.key = ""
 # config.dpo.secret = ""
 # config.dpo.callback_url = "http://localhost:8080/oauth/callback?provider=dpo"
 # config.dpo.user_info_mapping = {:email => "email", :name => "name"}

  # --- user config ---
  config.user_config do |user|

    user.reset_password_mailer_disabled = true

   # user.authentications_class = Authentication

  end

  config.user_class = "User"
end
