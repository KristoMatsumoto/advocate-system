class Collaboration < ApplicationRecord
  belongs_to :case
  belongs_to :user

  validate :user_cannot_be_admin

  private

  def user_cannot_be_admin
    errors.add(:user, "cannot be an admin") if user.admin?
  end
end
