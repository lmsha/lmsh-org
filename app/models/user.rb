class User < ActiveRecord::Base
  authenticates_with_sorcery!
  validates :password, length: { minimum: 6 }, if: :password_required?
  validates :password, confirmation: true, if: :password_required?
  validates :password_confirmation, presence: true, if: :password_required?
 
  before_validation do |user|
    user.email.downcase! if user.email_changed?
  end

  has_attached_file :avatar, :styles => { :medium => "300x300#", :thumb => "128x128#" }
  validates_attachment_content_type :avatar, :content_type => /\Aimage\/.*\Z/
  
  scope :normal, -> { where.not(role_id: 4)}

  def role
   if @role.nil? 
     @role = Role.new
     @role.value = role_id
   end
   @role
  end

  def role=(val)
    if val.is_a?(Symbol)
      @role = Role.new val
      self.role_id = @role.value 
    else
      self.role_id = val.to_i
    end
  end


  private 
    def password_required?
      (self.password.present? || self.password_confirmation.present?)
    end
end
