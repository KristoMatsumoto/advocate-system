class Api::V1::UsersController < ApplicationController
  # Можно позже включить авторизацию для других экшенов
#   skip_before_action :verify_authenticity_token

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

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :surname, :second_name, :role)
  end
end
