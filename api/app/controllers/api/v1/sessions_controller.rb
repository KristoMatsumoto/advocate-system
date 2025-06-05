class Api::V1::SessionsController < ApplicationController
  include ApiAuthentication

  skip_before_action :authenticate_api_user!, only: [:create]

  # POST /sessions
  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      render json: { token:, user: user.as_json(only: [:id, :email, :role, :name, :second_name, :surname]) }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  # GET /current
  def current
    if current_user
      render json: {
        user: current_user.as_json(only: [:id, :email, :role, :name, :second_name, :surname])
      }
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
end
