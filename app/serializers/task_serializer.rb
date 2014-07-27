class TaskSerializer < ActiveModel::Serializer
  attributes :id, :value, :category_id, :category, :form, :money
end