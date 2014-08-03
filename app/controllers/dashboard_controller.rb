class DashboardController < ApplicationController
  def index
    @counters = TaskCounter.values
    @values = TaskValue.values
  end
end
