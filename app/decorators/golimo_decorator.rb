class GolimoDecorator < Draper::Decorator
  delegate_all

  def fullname
    "#{object.last_name} #{object.name}"
  end

  def money
    object.money.to_i
  end

  def total_tasks
    object.tasks.count(:all)
  end

  def klass
    object.assignments.incomplete.empty? ? '' : 'has-task'
  end
end
