namespace :clear_all do
  desc "Clear resources"

  task users: :environment do
    User.normal.destroy_all
  end

  task golimos: :environment do
    Golimo.destroy_all
  end

  task tasks: :environment do
    Task.destroy_all
  end

end
