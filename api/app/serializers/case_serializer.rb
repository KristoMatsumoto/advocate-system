class CaseSerializer < ActiveModel::Serializer
    attributes :id, :title, :description, :start_date, :end_date, :court, :case_number, :client_name

    belongs_to :lawyer, class_name: 'User'
    has_many :media, serializer: MediumSerializer

    def media
        object.media.where(mediable_id: object.id)
    end
end
