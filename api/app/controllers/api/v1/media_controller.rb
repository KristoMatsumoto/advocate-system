class Api::V1::MediaController < ApplicationController
    include ApiAuthentication

    before_action :authenticate_api_user!
    before_action :authorize_collaboration!, only: [:create]
    before_action :set_parent, only: [:create]
    before_action :set_medium, only: [:show, :update, :destroy]
    before_action :authorize_author!, only: [:update, :destroy]

    # POST /cases/:case_id/media
    # POST /cases/:case_id/media/:medium_id
    def create
        medium = @parent.media.new(medium_params.merge(user: @current_user))

        if medium.save
            render json: medium, status: :created
            # render json: { id: medium.id, url: url_for(medium.file) }, status: :created
        else
            render json: { errors: medium.errors.full_messages }, status: :unprocessable_entity
        end
    end

    # GET /media/:id
    def show
        render json: {
            id: @medium.id,
            url: url_for(@medium.file),
            filename: @medium.file.filename.to_s,
            content_type: @medium.file.content_type,
            uploaded_by: @medium.user.name
        }
    end

    # PATCH/PUT /media/:id 
    def update
        if @medium.update(medium_params)
            render json: @medium, status: :ok
        else
            render json: { errors: @medium.errors.full_messages }, status: :unprocessable_entity
        end
    end

    # DELETE /media/:id
    def destroy
        if @medium.user == @current_user || @medium.case.lawyer == @current_user
            @medium.destroy
            head :no_content
        else
            render json: { error: "Unauthorized" }, status: :unauthorized
        end
    end

    private

    def set_medium
        @medium = Medium.find(params[:id])
    end

    def set_parent
        @parent = 
            if params[:medium_id].present?
                Medium.find(params[:medium_id]) 
            else
                Case.find(params[:case_id])
            end
    end

    def medium_params
        params.require(:media).permit(:title, :description, files: [])
    end

    def authorize_author!
        render json: { error: "Forbidden" }, status: :forbidden unless @medium.user == @current_user
    end

    def authorize_collaboration!
        return if Collaboration.exists?(case_id: params[:case_id], user_id: @current_user.id)

        render json: { error: "Forbidden" }, status: :forbidden
    end
end
