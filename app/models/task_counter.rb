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


  private
    def self.redis_key(team, category_id, form, simple)
      suf = simple ? "" : ":difficult"
      "#{Rails.application.config.redis_db}:tskc::#{team}:#{category_id}:#{form}:#{suf}"
    end
end