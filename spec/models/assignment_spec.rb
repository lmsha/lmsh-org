require 'spec_helper'

describe Assignment do

  let(:assignment) {FactoryGirl.create :assignment}

  describe "completeness" do 

    it "should complete assignment" do
      assignment.complete!
      assignment.reload
      expect(assignment.complete).to be_true      
      expect(Assignment.complete.count(:all)).to eq 1
    end
    
  end

end
