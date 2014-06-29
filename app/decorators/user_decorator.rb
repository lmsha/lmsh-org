class UserDecorator < Draper::Decorator
  delegate_all

  ROLE_NAMES = {'1' => '', '2' => 'редактор', '4' => 'администратор'}

  def role_name
    ROLE_NAMES[object.role.value.to_s]
  end

  def role_id
    object.role.key.to_s
  end
end
