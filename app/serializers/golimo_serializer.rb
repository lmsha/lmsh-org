class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :last_name, :fullname, :money, :form, :team, :total_tasks, :has_task
end