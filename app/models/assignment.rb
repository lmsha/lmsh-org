class Assignment < ActiveRecord::Base
  belongs_to :task
  belongs_to :golimo

  scope :incomplete, -> {where(complete: false)}
  scope :complete, -> {where(complete: true)}

  def complete!
    self.complete = true
    self.save!
  end 
end
