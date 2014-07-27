class GolimoDecorator < Draper::Decorator
  delegate_all

  def fullname
    "#{object.last_name} #{object.name}"
  end

  def money
    object.money.to_i
  end
end
