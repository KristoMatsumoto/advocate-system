class Api::V1::CollaborationsController < ApplicationController
    include ApiAuthentication
    
    before_action :authenticate_api_user!
    before_action :authorize_admin_or_owner!, only: [:create, :destroy]
    before_action :set_case

    # POST /cases/:case_id/collaboration
    def create
        params[:user_ids].each do |user|
            if @case.lawyer_id == user
                return render json: { error: "Owner cannot be a collaborator" }, status: :unprocessable_entity
            end
            @case.collaborations.create!(user_id: user)
        end

        render json: { collaborators: ActiveModelSerializers::SerializableResource.new(@case.collaborations, each_serializer: CollaborationSerializer) }, status: :created
    end

    # GET /cases/:case_id/collaboration
    def show
        render json: {
            owner: @case.lawyer,
            collaborators: ActiveModelSerializers::SerializableResource.new(@case.collaborations, each_serializer: CollaborationSerializer)
        }, status: :ok
    end

    # GET /cases/:case_id/collaboration/available_users
    def available
        all_users = User
            .where.not(id: [@case.lawyer_id] + @case.collaborations.pluck(:id))
            .where.not(role: "admin")
        render json: { available_users: all_users.as_json(only: [:id, :name, :second_name, :surname, :email, :role]) }, status: :ok
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
        render json: { error: 'Forbidden' }, status: :forbidden unless @current_user&.admin? || @current_user&.id == @case.lawyer_id
    end
end
