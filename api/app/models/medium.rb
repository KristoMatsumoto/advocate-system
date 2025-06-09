class Medium < ApplicationRecord
  belongs_to :user
  belongs_to :mediable, polymorphic: true
  has_many :media, as: :mediable, dependent: :destroy
  has_many_attached :files
end
