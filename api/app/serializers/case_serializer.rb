class CaseSerializer < ActiveModel::Serializer
    attributes :id, :title, :description, :start_date, :end_date, :court, :case_number

    belongs_to :lawyer, class_name: 'User'
    has_many :media
end
