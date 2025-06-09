Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :cases do
        resource :collaboration, only: [:show, :create, :destroy, :update]
        get "/collaboration/available_users", to: "collaborations#available"
        
        resources :media, only: [:create]
        post "/media/:medium_id", to: "media#create"
      end
      resources :media, only: [:show, :update, :destroy]
      
      resources :users, only: [:create, :index, :update]
      get "users/lawyers", to: "users#lawyers"
      get "users/roles", to: "users#roles"
      patch "/users/:id/change_password", to: "users#change_password"
      
      post 'login', to: 'sessions#create'
      get 'current_user', to: 'sessions#current'
    end
  end
end
