class DashboardController < ApplicationController
  def index
    @values = TaskValue.values
  end

  def counters
    @counters = TaskCounter.values
  end
end
