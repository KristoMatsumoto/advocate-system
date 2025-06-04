class User < ApplicationRecord
  has_secure_password

  enum role: { lawyer: 0, secretary: 1 } 

  has_many :cases_as_lawyer, class_name: 'Case', foreign_key: 'lawyer_id'
  has_many :collaborations
end
