Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :cases do
        resources :media, only: [:create]
        # resources :notes, only: [:create]
      end
      resources :notes, only: [:show, :update, :destroy]
      resources :media, only: [:show, :update, :destroy]
      
      resources :users, only: [:create, :index, :update]
      patch "/users/:id/change_password", to: "users#change_password"
      put "/users/:id/change_password", to: "users#change_password"
      
      post 'login', to: 'sessions#create'
      get 'current_user', to: 'sessions#current'
    end
  end
end
