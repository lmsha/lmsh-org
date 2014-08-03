class TasksController < ApplicationController
  before_filter :set_task, only: [:edit, :update, :destroy]

  def index
    @tasks = Task.all.decorate
    respond_to do |format|
     format.html
     format.json { render json: @tasks }
    end
  end

  def create
    @task = Task.new task_params
    if @task.save
      redirect_to tasks_path
    else
      redirect_to new_task_path
    end
  end

  def update
    if @task.update(task_params)
      redirect_to tasks_path
    else
      redirect_to task_update_path(@task)
    end
  end


  def destroy
    @task.destroy
    respond_to do |format|
     format.html redirect_to tasks_path
     format.json { render json: @task }
    end
  end

  private
    def set_task
      @task = Task.find_by_id(params[:id])
      if @task.nil?
        redirect_to tasks_path
      end
    end

    def task_params
      params.require(:task).permit(:number, :description, :form, :category_id)
    end
end
