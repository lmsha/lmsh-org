require 'spec_helper'

describe Golimo do
  let(:golimo) {FactoryGirl.create :golimo}
  let(:task) {FactoryGirl.create :task}

  describe "assignments and tasks" do 

    it "should return assignments" do
      Assignment.create golimo: golimo, task: task
      expect(golimo.assignments.size).to eq 1
      expect(golimo.task_ids.first).to eq task.id
    end

  end

  describe "money" do

    let(:user) { FactoryGirl.create :golimo}

    it "should withdraw" do
      user.money = BigDecimal(100)
      user.save!
      user.reload

      user.withdraw(10)
      expect(user.money.to_i).to eq 90
    end

    it "should deposit" do
      user.deposit(10)
      expect(user.money.to_i).to eq 10
    end

  end
end
