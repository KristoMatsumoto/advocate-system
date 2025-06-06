class Note < ApplicationRecord
  belongs_to :user
  belongs_to :notable, polymorphic: true
  has_many :notes, as: :notable, dependent: :destroy
end
