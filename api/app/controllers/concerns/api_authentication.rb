module ApiAuthentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_api_user!
  end

  def authenticate_api_user!
    header = request.headers['Authorization']
    token = header.split(' ').last if header

    begin
      decoded = JsonWebToken.decode(token)
      @current_user = User.find(decoded[:user_id])
    rescue
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end
