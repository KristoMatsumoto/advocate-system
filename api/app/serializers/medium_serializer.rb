class MediumSerializer < ActiveModel::Serializer
    attributes :id, :title, :description, :attachments, :user
    
    def attachments
        object.files.map do |file| {
            id: file.id,
            name: file.filename.to_s,
            url: Rails.application.routes.url_helpers.rails_blob_url(file, only_path: true),
            content_type: file.content_type,
            signed_id: file.signed_id
        } end
    end

    def user
        u = object.user
        return  {
            id: u.id,
            name: u.name,
            surname: u.surname,
        } if u
    end
end
