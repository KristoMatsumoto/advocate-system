class MediumSerializer < ActiveModel::Serializer
    attributes :id, :title, :description, :attachments

    belongs_to :case
    
    def attachments
        object.files.map do |file| {
            name: file.filename.to_s,
            url: Rails.application.routes.url_helpers.rails_blob_url(file, only_path: true)
        } end
    end
end
