require 'spec_helper'

describe ActiveKey do
  let(:key) { Faker::Name.name}

  it "should set value" do
    ActiveKey.new(key).set("123")
    expect($redis.get(key)).to eq "123"
  end

  it "should get value" do
    $redis.set(key, "234")
    expect(ActiveKey.new(key).get).to eq 234
  end

  it "should incr value" do
    $redis.set(key, "10")
    ActiveKey.new(key).incr
    expect($redis.get(key)).to eq "11"
  end

  it "should decr value" do
    $redis.set(key, "10")
    ActiveKey.new(key).decr
    expect($redis.get(key)).to eq "9"
  end
end
