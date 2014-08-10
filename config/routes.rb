Rails.application.routes.draw do
  resources :tasks

  resources :assignments

  resources :golimos do
    member do
      post :buy_task
      post :submit_task
      post :decline_task
      get :current_task
    end
  end

  get 'user_sessions/new', as: :login

  post 'user_sessions' => 'user_sessions#create'

  get 'user_sessions/destroy', as: :logout

  resources :users

  root 'users#index'

  get 'dashboard' => 'dashboard#index'
  get 'dashboard/counters' => 'dashboard#counters' 
end
