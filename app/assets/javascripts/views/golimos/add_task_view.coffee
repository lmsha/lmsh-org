do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.views ||= {}

  class pi.views.GolimosAddTaskView extends pi.views.Base
    constructor: ->
      super [{'loader':'add_task_loader'}, {form: 'add_task_form'}, 'add_task_popup', {message: 'add_task_message'}]

    show: (data) ->
      @form.value(data)

    task_assigned: (data) ->
      @message.html "<p>Вы купили задачу:</p><p>#{data.category} №#{data.number} (#{data.form})</p><p>Стоимость: #{data.value}</p>"