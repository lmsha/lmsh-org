class GolimoDecorator < Draper::Decorator
  delegate_all

  def fullname
    "#{object.last_name} #{object.name}"
  end

  def money
    object.money.to_f
  end

  def total_tasks
    object.tasks.count(:all)
  end

  def tasks_solved
    object.tasks.where("score > 0").count(:all)
  end

  def tasks_diff
    object.tasks.where("score > 18").count(:all)
  end

  def tasks_by_category(id)
    object.tasks.where("category_id = ? and score > 0", id).count(:all)
  end

  def klass
    object.assignments.incomplete.empty? ? '' : 'has-task'
  end
end
