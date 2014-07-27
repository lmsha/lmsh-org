require 'spec_helper'

describe TaskValue do

  describe "stats recalc" do

    before(:each) do 
      TaskValue.clear_all
    end

    describe "all categories" do

      it "default values" do
        expect(TaskValue.buy(1, 1)).to eq TaskValue::SIMPLE
        expect(TaskValue.sell(1, 1)).to eq TaskValue::SIMPLE
        expect(TaskValue.buy(1, 0)).to eq TaskValue::DIFFICULT
        expect(TaskValue.sell(1, 0)).to eq TaskValue::DIFFICULT
      end

      it "value stays the same if all categories are equally popular" do
        %i(1 2 3 4 5).each do |id|
          TaskValue::simple_solved(id).incr
          TaskValue.dif_solved(id).incr
          TaskValue::simple_open(id).incr
          TaskValue.dif_open(id).incr
          TaskValue.update(id)
        end
        expect(TaskValue.buy(1, 1)).to eq TaskValue::SIMPLE
        expect(TaskValue.sell(1, 1)).to eq TaskValue::SIMPLE
        expect(TaskValue.buy(1, 0)).to eq TaskValue::DIFFICULT
        expect(TaskValue.sell(1, 0)).to eq TaskValue::DIFFICULT
      end

    end 

    describe "one category" do

      it "value change if one simple task open" do
        TaskValue::simple_open(1).incr
        TaskValue.update(1)

        expect(TaskValue.buy(1, 1)).to be < TaskValue::SIMPLE
        expect(TaskValue.buy(1, 0)).to be < TaskValue::DIFFICULT
        expect(TaskValue.sell(1, 1)).to be > TaskValue::SIMPLE
        expect(TaskValue.sell(1, 0)).to be > TaskValue::DIFFICULT
      end

      it "value change if one simple task solved" do
        TaskValue::simple_solved(1).incr
        TaskValue.update(1)

        expect(TaskValue.buy(1, 1)).to be < TaskValue::SIMPLE
        expect(TaskValue.buy(1, 0)).to be <  TaskValue::DIFFICULT
        expect(TaskValue.sell(1, 1)).to be > TaskValue::SIMPLE
        expect(TaskValue.sell(1, 0)).to be > TaskValue::DIFFICULT

      end

      it "value change if one dif task solved" do
        TaskValue.dif_solved(1).incr
        TaskValue.update(1)

        expect(TaskValue.buy(1, 0)).to be < TaskValue::DIFFICULT
        expect(TaskValue.buy(1, 0)).to be <  TaskValue::DIFFICULT
        expect(TaskValue.sell(1, 1)).to be > TaskValue::SIMPLE
        expect(TaskValue.sell(1, 0)).to be > TaskValue::DIFFICULT

      end


      it "value change if one dif task solved" do
        TaskValue.dif_solved(1).incr
        TaskValue.update(1)

        expect(TaskValue.buy(1, 0)).to be < TaskValue::DIFFICULT
        expect(TaskValue.buy(1, 0)).to be <  TaskValue::DIFFICULT
        expect(TaskValue.sell(1, 1)).to be > TaskValue::SIMPLE
        expect(TaskValue.sell(1, 0)).to be > TaskValue::DIFFICULT

      end

    end


    describe "several categories" do

      it "should decrease one and increase another" do
        TaskValue.dif_solved(1).incr
        TaskValue.update(1)

        expect(TaskValue.buy(1, 1)).to be < TaskValue::SIMPLE
        expect(TaskValue.buy(2, 1)).to be >  TaskValue::SIMPLE
      end

      it "should decrease two equally and increase others" do
        TaskValue.dif_solved(1).incr
        TaskValue.dif_solved(2).incr
        TaskValue.update(1)
        TaskValue.update(2)

        expect(TaskValue.buy(1, 1)).to eq TaskValue.buy(2, 1)
        expect(TaskValue.buy(3, 1)).to be > TaskValue::SIMPLE
      end

    end

  end

end
