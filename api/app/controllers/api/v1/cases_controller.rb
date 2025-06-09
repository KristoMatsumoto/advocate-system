class Api::V1::CasesController < ApplicationController
    include ApiAuthentication

    before_action :authenticate_api_user!
    before_action :set_case, only: [:show, :update]
    before_action :authorize_access!, only: [:show]
    before_action :authorize_owner!, only: [:update]

    # GET /cases
    def index
        cases = Case.all
            .left_outer_joins(:collaborations)
            .where("cases.lawyer_id = :user_id OR collaborations.user_id = :user_id", user_id: @current_user.id)
        cases = Case.all if @current_user.admin?

        if params[:search].present?
            terms = params[:search].downcase.split(" ")
            terms.each do |term|
                cases = cases.where(
                    "LOWER(title) LIKE :term OR LOWER(description) LIKE :term OR LOWER(case_number) LIKE :term",
                    term: "%#{term}%"
                )
            end
        end
        cases = cases.distinct

        sort_column = params[:sort] || "created_at"
        sort_dir = params[:direction] == "asc" ? :asc : :desc
        cases = cases.order(sort_column => sort_dir)

        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 10).to_i
        total = cases.count
        cases = cases.offset((page - 1) * per_page).limit(per_page)

        render json: { cases: cases.as_json(only: [:id, :title, :description]), meta: { total: total, page: page, per_page: per_page } }, status: :ok
    end

    # GET /cases/:id
    def show
        render json: @case, serializer: ::CaseSerializer, status: :ok
    end

    # POST /cases
    def create
        return head :forbidden if current_user.secretary?

        kase = Case.new(case_params)
        if kase.save
            render json: kase, status: :created
        else
            render json: { errors: kase.errors.full_messages }, status: :unprocessable_entity
        end
    end

    # PATCH/PUT /cases/:id
    def update
        unless @current_user == @case.lawyer || @case.collaborators.include?(@current_user)
            render json: { error: "Forbidden" }, status: :forbidden
        end

        if @case.update(case_params)
            render json: @case, status: :ok
        else
            render json: { errors: @case.errors.full_messages }, status: :unprocessable_entity
        end
    end

    # # DELETE /cases/:id
    # def destroy
    #     return head :forbidden unless current_user.secretary?

    #     @case.destroy
    #     head :no_content
    # end

    private

    def set_case
        @case = Case.find(params[:id])
    end

    def case_params
        params.require(:case).permit(:title, :description, :court, :start_date, :end_date, :lawyer_id, :client_name, :case_number)
    end

    def authorize_access!
        return if current_user.admin? || @case.collaborators.exists?(@current_user.id) || @case.lawyer == @current_user

        render json: { error: 'Forbidden' }, status: :forbidden
    end

    def authorize_owner!
        render json: { error: 'Forbidden' }, status: :forbidden unless @current_user.id == @case.lawyer_id
    end
end
