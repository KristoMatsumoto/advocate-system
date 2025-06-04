class ApplicationController < ActionController::API
  before_action :authenticate_request

  def authenticate_request
    header = request.headers['Authorization']
    token = header&.split(' ')&.last
    decoded = JWT.decode(token, JWT_SECRET)[0] rescue nil
    @current_user = User.find(decoded['user_id']) if decoded
  rescue
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end
end
