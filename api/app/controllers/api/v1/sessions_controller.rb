class Api::V1::SessionsController < ApplicationController
  include ApiAuthentication

  skip_before_action :authenticate_api_user!, only: [:create]

  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      render json: { token:, user: user.as_json(only: [:id, :email, :role, :name, :surname]) }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def current
    render json: { user: @current_user.as_json(only: [:id, :email, :role, :name, :second_name, :surname]) }
  end
end
