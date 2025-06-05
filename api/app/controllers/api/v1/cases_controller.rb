class Api::V1::CasesController < ApplicationController
  include ApiAuthentication

  before_action :set_case, only: [:show, :update, :destroy]
  before_action :authorize_access!, only: [:show, :update, :destroy]

  # GET /cases
  def index
    query = params[:query].to_s.strip.downcase
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 5).to_i

    cases = Case.all

    if query.present?
      cases = cases.where("LOWER(title) LIKE ?", "%#{query}%")
    end

    total_count = cases.count
    cases = cases.order(created_at: :desc)
                 .offset((page - 1) * per_page)
                 .limit(per_page)

    render json: {
      cases: cases.as_json(only: [:id, :title, :description]),
      meta: {
        current_page: page,
        per_page: per_page,
        total_pages: (total_count.to_f / per_page).ceil,
        total_count: total_count
      }
    }
  end

  # GET /cases/:id
  def show
    render json: @case, status: :ok
  end

  # POST /cases
  def create
    return head :forbidden unless current_user.secretary?

    kase = Case.new(case_params)
    if kase.save
      render json: kase, status: :created
    else
      render json: { errors: kase.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /cases/:id
  def update
    return head :forbidden unless current_user.secretary?

    if @case.update(case_params)
      render json: @case, status: :ok
    else
      render json: { errors: @case.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /cases/:id
  def destroy
    return head :forbidden unless current_user.secretary?

    @case.destroy
    head :no_content
  end

  private

  def set_case
    @case = Case.find(params[:id])
  end

  def authorize_access!
    return if current_user.secretary? || @case.lawyer == current_user

    render json: { error: 'Unauthorized' }, status: :unauthorized
  end

  def case_params
    params.require(:case).permit(:title, :description, :court, :act_of_case, :start_date, :end_date, :lawyer_id, :client_name, :case_number)
  end
end
