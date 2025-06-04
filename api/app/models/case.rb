class Case < ApplicationRecord
  belongs_to :lawyer, class_name: 'User'
  has_many :notes, as: :noteable, dependent: :destroy
  has_many :media, dependent: :destroy
  has_many :collaborations, dependent: :destroy

  validates :title, presence: true
  validates :act_of_case, presence: true, uniqueness: true
  validates :client_name, presence: true
  validates :court, presence: true

  validate :end_date_after_start_date

  private

  def end_date_after_start_date
    if end_date.present? && start_date.present? && end_date < start_date
      errors.add(:end_date, "nie może być wcześniejsza niż data rozpoczęcia")
    end
  end
end
