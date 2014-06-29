require 'spec_helper'

describe User do

  describe "save should fail due to invalid password"  do
      let(:user) do
        FactoryGirl.build :user
      end
      
      it "should raise error when password is too short" do 
        user.password = user.password_confirmation = "abc"
        expect {user.save!}.to raise_error(ActiveRecord::RecordInvalid,/Password is too short/)
      end

      it "should raise error when password doesn't match confirmation" do 
        user.password = "qwerty2013"
        user.password_confirmation = "qwerty2014"
        expect {user.save!}.to raise_error(ActiveRecord::RecordInvalid,/Password confirmation doesn't match Password/)
      end

    end


  describe "email operations" do  
      let(:user){ FactoryGirl.build :user }

      describe "email address with mixed case" do
        let(:mixed_case_email) { "Foo@ExAMPle.CoM" }
        
        it "should be saved as all lower-case" do
          user.email = mixed_case_email
          user.save
          expect(user.reload.email).to eq mixed_case_email.downcase
        end
      end

  end

  describe "user role" do
    it "should return correct role for user" do
      user = FactoryGirl.create :user
      user.reload
      expect(user.role.key).to eq :user
      expect(user.role.value).to eq 1
      expect(user.role_id).to eq 1 
    end

    it "should return correct role for moderator" do
      user = FactoryGirl.create :moderator
      user.reload
      expect(user.role.key).to eq :moderator
      expect(user.role.value).to eq 2
      expect(user.role_id).to eq 2
    end

    it "should return correct role for manager" do
      user = FactoryGirl.create :manager
      user.reload
      expect(user.role.key).to eq :manager
      expect(user.role.value).to eq 4
      expect(user.role_id).to eq 4 
    end

    it 'should update user role' do 
      user = FactoryGirl.create :user
      user.role = :moderator
      user.save!
      user.reload
      expect(user.role.key).to eq :moderator
      expect(user.role.value).to eq 2
      expect(user.role_id).to eq 2
    end

  end
end
