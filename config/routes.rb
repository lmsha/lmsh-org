Rails.application.routes.draw do
  get 'finance/index'

  resources :teachers

  resources :events

  resources :courses

  resources :golimos

  get 'user_sessions/new', as: :login

  post 'user_sessions' => 'user_sessions#create'

  get 'user_sessions/destroy', as: :logout

  resources :users

  root 'users#index'

end
