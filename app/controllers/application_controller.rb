class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_filter :require_login

  helper_method :current_role

  def current_role
    @current_role ||= current_user.role    
  end

  private
    def not_authenticated
      redirect_to login_path, alert: "Необходимо авторизоваться"
    end

    def send_event(type,data_)
      RealtimeEventController.publish('/event', {event: type,data: data_})
    end
end

