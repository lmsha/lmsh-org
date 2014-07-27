class Golimo < ActiveRecord::Base
  has_many :assignments
  has_many :tasks, through: :assignments

  def has_money?(value=0)
    self.money >= value
  end

  def withdraw(value)
    if self.money >= value
      self.with_lock do
        self.money -= value
        self.save!
      end
    end
  end

  def deposit(value)
    self.with_lock do
      self.money += value
      self.save!
    end
  end

end
