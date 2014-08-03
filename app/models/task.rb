class Task < ActiveRecord::Base

  has_many :assignments, dependent: :destroy

  attr_accessor :value

  def self.find_for_team(team, category_id, form, simple)
    binding.pry
    if TaskCounter.get(team, category_id, form,  simple) > 0
      Task.order("RANDOM()").limit(1).where(category_id: category_id, form: form,  simple: simple).where.not(id: Assignment.where(team: team).pluck(:task_id)).first
    end
  end

  def category
    if @category.nil?
      @category = Category.new
      @category.value = self.category_id
    end
    @category
  end
end
