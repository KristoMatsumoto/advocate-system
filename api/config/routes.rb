Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :cases
      resources :notes, only: [:create, :show, :update, :destroy]
      resources :media, only: [:show, :create, :destroy]
      post 'login', to: 'sessions#create'
      post 'signup', to: 'users#create'
      get 'current_user', to: 'sessions#current'
    end
  end
end
