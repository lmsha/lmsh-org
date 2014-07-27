class TaskValue

  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  SIMPLE = 10
  DIFFICULT = 30

  DEFAULT_VALUE = 1

  SIMPLE_K = 0.5
  OPEN_K = 0.5

  def self.buy(category_id, simple)
    val = 1 - ((coef(category_id).get - avg)/ total_value)
    if simple > 0
      val*=SIMPLE
    else
      val*=DIFFICULT
    end
    val.round(2)
  end

  def self.sell(category_id, simple)
    val = 1 + ((coef(category_id).get - avg)/ total_value)
    if simple > 0
      val*=SIMPLE
    else
      val*=DIFFICULT
    end
    val.round(2)
  end

  def self.update(category_id)
    sum = dif_solved(category_id).get + SIMPLE_K*simple_solved(category_id).get + OPEN_K * (dif_open(category_id).get + SIMPLE_K*simple_open(category_id).get)
    active_key("coef",category_id.to_s).set sum
    update_total
  end

  def self.clear_all
    Category.values.each do |category|
      dif_solved(category).set DEFAULT_VALUE
      dif_open(category).set DEFAULT_VALUE
      simple_open(category).set DEFAULT_VALUE
      simple_solved(category).set DEFAULT_VALUE
      update category
    end
  end 

  def self.opened(task)
    if task.simple.to_i
      simple_open(task.category_id).incr
    else
      dif_open(task.category_id).incr
    end
    update task.category_id
  end

  def self.solved(task)
    $redis.multi do
      if task.simple > 0
        simple_open(task.category_id).decr
        simple_solved(task.category_id).incr
      else
        dif_open(task.category_id).decr
        dif_solved(task.category_id).incr
      end
    end
    update task.category_id
  end

  def self.declined(task)
    $redis.multi do
      if task.simple > 0
        simple_open(task.category_id).decr
      else
        dif_open(task.category_id).decr
      end
    end
    update task.category_id
  end

  class << self
    %w(dif_solved simple_solved dif_open simple_open coef).each do |method|
      define_method(method) do |category_id|
        active_key method, category_id.to_s
      end
    end
  end

  private
    def self.active_key(*args)
      ActiveKey.new "#{Rails.application.config.redis_db}:tskv::#{args.join(':')}"
    end

    def self.avg
      (total_value / Category.values.size)
    end
    
    def self.total_value
      active_key("total_value").get
    end

    def self.update_total
      sum = 0
      Category.values.each do |category|
        sum += active_key("coef",category.to_s).get  
      end
      active_key("total_value").set sum
    end
end