class User < ApplicationRecord
  has_secure_password

  enum role: { lawyer: 0, secretary: 1, admin: 2 } 

  has_many :cases_as_lawyer, class_name: 'Case', foreign_key: 'lawyer_id'
  has_many :collaborations
  has_many :collaborated_cases, through: :collaborations, source: :case

  validates :name, presence: true
  validates :surname, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
end
