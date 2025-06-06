class Api::V1::UsersController < ApplicationController
  include ApiAuthentication
  
  before_action :authenticate_api_user!, only: [:index]
  before_action :authorize_admin!, only: [:index]

  def index
    users = User.order(created_at: :desc)
    render json: users, status: :ok
  end

  def create
    user = User.new(user_params)
    if user.save
      token = JsonWebToken.encode(user_id: user.id)
      render json: { token:, user: user.as_json(only: [:id, :email, :role, :name, :surname]) }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  private

  def authorize_admin!
    render json: { error: "Forbidden" }, status: :forbidden unless current_user.admin?
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :surname, :second_name, :role)
  end
end
