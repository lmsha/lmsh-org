class GolimosController < ApplicationController

  before_action :set_user, only: [:buy_task, :submit_task, :decline_task, :current_task]
  before_action :set_task, only: [:submit_task, :decline_task]

  def index
    @users = Golimo.all.includes(:tasks).order(last_name: :desc).decorate
    respond_to do |format|
     format.html
     format.json { render json: @users }
    end
  end

  def buy_task
    if @user.assignments.incomplete.count(:all) > 0
      render status: :forbidden, text: "нельзя брать два задания" and return
    end
    @task = Task.find_for_team(@user.team, assign_params[:category_id].to_i, @user.form, assign_params[:simple].to_i)
    if @task.nil?
      render status: :forbidden, text: "нет подходящих заданий" and return
    else
      value = TaskValue.sell @task.category_id, @task.simple
      if @user.has_money?(value)
        @task.assignments.create! golimo: @user, team: @user.team
        @user.withdraw value
        @task.value = value
        TaskValue.opened @task
        val = TaskCounter.decr @user.team, @task.category_id, @task.form, @task.simple.to_i
        @user = @user.decorate
        send_event 'user', @user.as_json.merge(klass: @user.klass, total_tasks: @user.total_tasks, fullname: @user.fullname)
        send_event 'values', TaskValue.values
        render json: @task.decorate
      else
        render status: :forbidden, text: "недостаточно средств" and return
      end
    end
  end

  def current_task
    assignment = @user.assignments.incomplete.first
    if assignment.nil?
      render status: :not_found, text: "у голимчика нет заданий" and return
    else
      render json: assignment.task.decorate
    end
  end

  def submit_task
    value = TaskValue.buy @task.category_id, @task.simple
    @assignment.score = value
    @assignment.complete!
    @user.deposit value
    TaskValue.solved @task
    @user = @user.decorate
    send_event 'user', @user.as_json.merge(klass: @user.klass, total_tasks: @user.total_tasks, fullname: @user.fullname)
    send_event 'values', TaskValue.values
    render json: @assignment
  end

  def decline_task
    @assignment.score = 0
    @assignment.complete!
    TaskValue.declined @task
    @user = @user.decorate
    send_event 'user', @user.as_json.merge(klass: @user.klass, total_tasks: @user.total_tasks, fullname: @user.fullname)
    send_event 'values', TaskValue.values
    render json: @assignment
  end

  private
    def assign_params
      params.permit(:category_id, :simple)
    end

    def set_task
      @task = Task.find_by_id params[:task_id]
      if @task.nil?
        render status: :not_found, text: "задание не найдено" and return
      end
      
      @assignment = Assignment.incomplete.find_by(golimo: @user, task: @task)
      if @assignment.nil?
        render status: :not_found, text: "назначение не найдено" and return
      end

    end

    def set_user
      @user = Golimo.find_by_id params[:id]
      if @user.nil?
        render status: :not_found, text: "голимчик не найден" and return
      end
    end
end