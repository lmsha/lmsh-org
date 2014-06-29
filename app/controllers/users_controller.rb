class UsersController < ApplicationController
  def index
    @users = User.all.order(role_id: :desc).decorate
  end
end
