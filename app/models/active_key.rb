class ActiveKey

  def initialize(key)
    @key = key
  end

  %i(set incr decr del).each do |method|
    define_method(method) do |*args|
      $redis.send(method, @key, *args)
    end
  end

  def get
    $redis.get(@key).to_f
  end

end