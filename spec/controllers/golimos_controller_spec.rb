require 'spec_helper'

describe GolimosController do
  ApplicationController.skip_before_action :verify_authenticity_token
  ApplicationController.skip_before_action :require_login

  render_views

  before(:each) do
    TaskCounter.set 1, 1, 8, 1, 1
    TaskCounter.set 1, 1, 8, 0, 1
    @task = FactoryGirl.create :task, category_id: 1, simple: 1, form: 8
    @dif_task = FactoryGirl.create :task, category_id: 1, simple: 0, form: 8
  end

  after(:each) do
    TaskValue.clear_all
    @task.destroy
    @dif_task.destroy
  end

  let(:golimo) { FactoryGirl.create :golimo, team: 1, form: 8, money: BigDecimal(10)}
  let(:task) { FactoryGirl.create :task, category_id: 1, simple: 1, form: 8}

  it "should buy task" do
    _old_price = TaskValue.buy 1, 1

    post :buy_task, id: golimo.id, category_id: 1, simple: 1
    expect(response.status).to eq(200)

    golimo.reload

    info = parse_json(response.body, "task")
    expect(info["value"]).to eq 10
    expect(golimo.task_ids).to include(info["id"])
    expect(TaskValue.sell(1,1)).to be > _old_price
    expect(golimo.money).to eq(0)
  end

  it "should not buy task if user has one" do
    golimo.assignments.create! task: task
    
    post :buy_task, id: golimo.id, category_id: 1, simple: 1
    expect(response.status).to eq(403)
    expect(response.body).to eq "нельзя брать два задания"
    expect(golimo.tasks.count(:all)).to eq 1
  end

  it "should not buy task if there is no tasks" do
    post :buy_task, id: golimo.id, category_id: 1, simple: 1
    expect(response.status).to eq(200)
    info = parse_json(response.body, "task")

    post :decline_task, id: golimo.id, task_id: info["id"]
    expect(response.status).to eq(200)

    golimo.deposit(10)

    post :buy_task, id: golimo.id, category_id: 1, simple: 1
    
    expect(response.status).to eq(403)
    expect(response.body).to eq "нет подходящих заданий"
  end

  it "should not buy task if user has no money" do
    post :buy_task, id: golimo.id, category_id: 1, simple: 0
    expect(response.status).to eq(403)
    expect(response.body).to eq "недостаточно средств"
    expect(golimo.tasks.count(:all)).to eq 0
  end

  it "should submit task as correct" do
    golimo.assignments.create! task: task
    TaskValue.simple_open 1
    TaskValue.update 1

    _old_price = TaskValue.buy 1, 1

    post :submit_task, id: golimo.id, task_id: task.id
    expect(response.status).to eq(200)
    expect(golimo.assignments.complete.count(:all)).to eq 1
    expect(TaskValue.buy(1, 1)).to be < _old_price
  end


  it "should submit task as incorrect" do
    golimo.assignments.create! task: task
    TaskValue.simple_open 1
    TaskValue.update 1
    _old_price = TaskValue.buy 1, 1

    post :decline_task, id: golimo.id, task_id: task.id
    expect(response.status).to eq(200)
    expect(golimo.assignments.complete.count(:all)).to eq 1
    expect(TaskValue.buy(1, 1)).to be > _old_price
  end

end
