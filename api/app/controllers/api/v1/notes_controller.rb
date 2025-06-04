class Api::V1::NotesController < ApplicationController
    before_action :authorize_request
    before_action :set_note, only: [:show, :update, :destroy]

    # def index
    #     notes = Note.where(case: @case) # или фильтр по делу/медиа/другому note
    #     render json: notes
    # end

    def show
        render json: @note
    end

    def create
        note = Note.new(note_params.merge(user: @current_user))
        if note.save
            render json: note, status: :created
        else
            render json: { errors: note.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def update
        if @note.user == @current_user && @note.update(note_params)
            render json: @note
        else
            render json: { error: "Not authorized or invalid data" }, status: :unauthorized
        end
    end

    def destroy
        if @note.user == @current_user
            @note.destroy
            head :no_content
        else
            render json: { error: "Not authorized" }, status: :unauthorized
        end
    end

    private

    def set_note
        @note = Note.find(params[:id])
    end

    def note_params
        params.require(:note).permit(:content, :notable_type, :notable_id)
    end
end