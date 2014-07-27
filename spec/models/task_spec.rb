require 'spec_helper'

describe Task do
  
  before(:all) do
    TaskCounter.set 1, 1, 8, 1, 1
    TaskCounter.set 1, 2, 8, 0, 1
    TaskCounter.set 1, 2, 9, 0, 1

    Task.create category_id: 1, simple: 1, form: 8, description: "a"
    Task.create category_id: 1, simple: 1, form: 8, description: "b"
    Task.create category_id: 1, simple: 1, form: 8, description: "c"
    Task.create category_id: 2, simple: 0, form: 9 

    Assignment.create(task:  Task.create(category_id: 1, simple: 1), team: 1)
  end

  let(:user) {FactoryGirl.create :golimo, team: 1}

  describe "find for user test" do
    it "should find simple task for user" do
      expect(Task.find_for_team(user.team,1,8,1)).to_not be_nil
      expect(Task.find_for_team(user.team,1,9,1)).to be_nil
    end

    it "should find non-simple task for user" do
      expect(Task.find_for_team(user.team,2,9,0)).to_not be_nil
    end

    it "should not find task for user if there is no task" do
      expect(Task.find_for_team(user.team,3,8,1)).to be_nil
    end
  end

  describe "test randomness" do
    it "should return random task" do 
      first = Task.find_for_team(user.team,1,8,1)
      random = false

      10.times do 
        _desc = Task.find_for_team(user.team,1,8,1).description
        random = random || !(first.description == _desc)
      end

      expect(random).to be_true
    end

  end


end
