Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :cases
      resources :notes, only: [:create, :show, :update, :destroy]
      resources :media, only: [:show, :create, :destroy]
      resources :users, only: [:create, :index]
      post 'login', to: 'sessions#create'
      get 'current_user', to: 'sessions#current'
    end
  end
end
