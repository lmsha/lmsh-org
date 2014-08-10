require 'spec_helper'

describe TaskCounter do
  before(:each) do 
    TaskCounter.set 1,1,7,1,2
    TaskCounter.set 1,1,7,0,1
  end

  describe "operations" do
    it "get value" do
      expect(TaskCounter.get(1,1,7,1)).to eq 2
      expect(TaskCounter.get(1,1,7,0)).to eq 1
    end

    it "decr value" do
      TaskCounter.decr 1,1,7,1
      TaskCounter.decr 1,1,7,0
      expect(TaskCounter.get(1,1,7,1)).to eq 1
      expect(TaskCounter.get(1,1,7,0)).to eq 0
    end
  end

end
