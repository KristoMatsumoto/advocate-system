class Medium < ApplicationRecord
  belongs_to :case
  belongs_to :user
  has_many :notes, as: :notable, dependent: :destroy
  has_many_attached :files

  validates :title, presence: true
end
