class Api::V1::MediaController < ApplicationController
    before_action :authorize_request
    before_action :set_medium, only: [:show, :destroy]

    def show
        render json: {
            id: @medium.id,
            url: url_for(@medium.file),
            filename: @medium.file.filename.to_s,
            content_type: @medium.file.content_type,
            uploaded_by: @medium.user.name
        }
    end

    def create
        medium = Medium.new(case_id: params[:case_id], user: @current_user)
        medium.file.attach(params[:file])

        if medium.save
            render json: { id: medium.id, url: url_for(medium.file) }, status: :created
        else
            render json: { errors: medium.errors.full_messages }, status: :unprocessable_entity
        end
    end

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
end
