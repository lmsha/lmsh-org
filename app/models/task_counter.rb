class TaskCounter

  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  def self.get(team, category_id, form, simple)
    $redis.get(redis_key(team, category_id, form,  simple)).to_i
  end

  def self.decr(team, category_id, form, simple)
    $redis.decr redis_key(team,category_id, form, simple)
  end

  def self.set(team, category_id, form, simple, value)
    $redis.set redis_key(team, category_id, form, simple), value
  end

  def self.values
    counters = []
    [1,2,3,4].each do |t|
      counter = {categories: [], team: t}
      Category.enums.each do |cat,id|
        category = {title: cat, forms: [], id: id}
        counter[:categories] << category 
        [7,8,9,10].each do |f|
          category[:forms] << {
            title: f,
            simple: TaskCounter.get(t,id,f,1),
            dif: TaskCounter.get(t,id,f,0)
          }
        end
      end
      counters << counter
    end
    counters
  end

  private
    def self.redis_key(team, category_id, form, simple)
      suf = simple>0 ? "" : ":difficult"
      "#{Rails.application.config.redis_db}:tskc::#{team}:#{category_id}:#{form}:#{suf}"
    end
end