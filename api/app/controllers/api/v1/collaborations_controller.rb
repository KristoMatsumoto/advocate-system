class Api::V1::CollaborationsController < ApplicationController
    include ApiAuthentication
    
    before_action :authenticate_api_user!
    before_action :set_case
    before_action :authorize_admin_or_owner!, only: [:create, :update, :destroy]

    # POST /cases/:case_id/collaboration
    def create
        params[:user_ids].each do |user|
            if @case.lawyer_id == user
                return render json: { error: "Owner cannot be a collaborator" }, status: :unprocessable_entity
            end
            @case.collaborations.create!(user_id: user)
        end

        render json: { collaborators: @case.collaborations.includes(:user).map(&:user) }, status: :created
    end

    # GET /cases/:case_id/collaboration
    def show
        render json: {
            owner: @case.lawyer,
            collaborators: @case.collaborations.includes(:user).map(&:user)
        }, status: :ok
    end

    # GET /cases/:case_id/collaboration/available_users
    def available
        all_users = User
            .where.not(id: [@case.lawyer_id] + @case.collaborations.includes(:user).map(&:user).pluck(:id))
            .where.not(role: "admin")
        render json: { available_users: all_users.as_json(only: [:id, :name, :second_name, :surname, :email, :role]) }, status: :ok
    end

    def update
        incoming_ids = params[:user_ids].map(&:to_i)
        current_ids = @case.collaborations.pluck(:id)

        if incoming_ids.include?(@case.lawyer_id)
            return render json: { error: "Owner cannot be a collaborator" }, status: :unprocessable_entity
        end

        to_add = incoming_ids - current_ids
        to_remove = current_ids - incoming_ids

        to_add.each do |user_id|
            @case.collaborations.create!(user_id: user_id)
        end

        @case.collaborations.where(id: to_remove).destroy_all

        render json: { collaborators: @case.collaborations.includes(:user).map(&:user) }, status: :ok
    end

    # DELETE /cases/:case_id/collaboration
    def destroy
        collaboration = @case.collaborations.find_by(user_id: params[:user_id])
        
        return render json: { error: "Collaboration not find" }, status: :unprocessable_entity unless collaboration
        
        collaboration.destroy
        head :no_content
    end

    private

    def set_case
        @case = Case.find(params[:case_id])
    end
    
    def authorize_admin_or_owner!
        render json: { error: 'Forbidden' }, status: :forbidden unless @current_user.admin? || @current_user.id == @case.lawyer_id
    end
end
