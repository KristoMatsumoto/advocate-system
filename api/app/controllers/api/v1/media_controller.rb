class Api::V1::MediaController < ApplicationController
    before_action :authorize_access!, only: [:show, :update]
    before_action :set_case, only: [:create]
    before_action :set_medium, only: [:show, :update, :destroy]

    # POST /media
    def create
        media = @case.media.new(media_params.merge(user: @current_user))

        if media.save
            render json: media, status: :created
            # render json: { id: medium.id, url: url_for(medium.file) }, status: :created
        else
            render json: { errors: media.errors.full_messages }, status: :unprocessable_entity
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

    # PATCH/PUT /case/:case_id/media/:id 
    def update
        if media.update(media_params)
            remove_attachments if params[:media][:removed_attachment_ids].present?
            render json: media, status: :ok
        else
            render json: { errors: media.errors.full_messages }, status: :unprocessable_entity
        end
    end

    # DELETE /media/:id
    # DELETE /case/:case_id/media/:id
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

    def set_case
        @case = Case.find(params[:case_id])
    end

    def media_params
        params.require(:media).permit(:title, :description, files: [])
    end

    def remove_attachments
        attachment_ids = params[:media][:removed_attachment_ids].map(&:to_i)
        attachments = @media.files.where(id: attachment_ids)
        attachments.each(&:purge)
    end
end
