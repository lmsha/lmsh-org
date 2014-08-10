class TaskDecorator < Draper::Decorator
  delegate_all

  CAT_TO_NAME = {
    math: 'Математика',
    phys: 'Физика',
    bio: 'Биология',
    chem: 'Химия',
    hum: 'Гуманитария'
  }

  def category
    CAT_TO_NAME[object.category.key]
  end

  def form
    "#{object.form} класс"
  end

  def name
    ""
  end
end
