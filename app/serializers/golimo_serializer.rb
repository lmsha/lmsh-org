class GolimoSerializer < ActiveModel::Serializer
  attributes :id, :name, :last_name, :fullname, :money, :form, :team, :total_tasks, :klass
end