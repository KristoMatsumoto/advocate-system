class Api::V1::UsersController < ApplicationController
    include ApiAuthentication
    
    before_action :authenticate_api_user!, only: [:index, :lawyers, :roles, :update, :change_password]
    before_action :authorize_admin!, only: [:index, :lawyers]
    before_action :authorize_current!, only: [:update, :change_password]

    # GET /users
    def index
        users = User.all

        if params[:search].present?
            terms = params[:search].downcase.split(" ")
            terms.each do |term|
                users = users.where(
                    "LOWER(name) LIKE :term OR LOWER(surname) LIKE :term OR LOWER(second_name) LIKE :term",
                    term: "%#{term}%"
                )
            end
        end
        
        users = users.where(role: params[:role]) if params[:role].present?

        sort_column = params[:sort] || "created_at"
        sort_dir = params[:direction] == "asc" ? :asc : :desc
        users = users.order(sort_column => sort_dir)

        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 10).to_i
        total = users.count
        users = users.offset((page - 1) * per_page).limit(per_page)

        render json: { users: users,  meta: { total: total, page: page, per_page: per_page } }, status: :ok
    end

    # GET /users/lawyers
    def lawyers
        users = User.all.where(role: "lawyer")
        render json: { users: users }, status: :ok
    end

    # GET /users/roles
    def roles
        render json: { roles: User.roles.keys}, status: :ok
    end

    # POST /users
    def create
        user = User.new(user_params)
        if user.save
            token = JsonWebToken.encode(user_id: user.id)
            render json: { token:, user: user.as_json(only: [:id, :email, :role, :name, :second_name, :surname]) }, status: :created
        else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
    end
    
    # PATCH/PUT /users/:id
    def update
        if @user.update(user_update_params)
            render json: { user: @user.as_json(only: [:id, :email, :role, :name, :second_name, :surname]) }, status: :ok
        else
            render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
    end

    # PATCH/PUT /users/:id/change_password
    def change_password
        if @user.authenticate(params[:current_password])
            if @user.update(password: params[:password])
                render json: { message: "Password updated" }, status: :ok
            else
                render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
            end
        else
            render json: { error: "Incorrect current password" }, status: :unauthorized
        end
    end

    private

    def authorize_admin!
        render json: { error: "Forbidden" }, status: :forbidden unless current_user.admin?
    end

    def authorize_current!
        @user = User.find(params[:id])
        if @user != @current_user
            render json: { error: "Forbidden" }, status: :forbidden
            return
        end
    end

    def user_params
        params.require(:user).permit(:email, :password, :password_confirmation, :name, :surname, :second_name, :role)
    end

    def user_update_params
        params.require(:user).permit(:email, :name, :surname, :second_name)
    end
end
