do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.views ||= {}

  class pi.views.GolimosSubmitTaskView extends pi.views.Base
    constructor: ->
      super [{'loader':'submit_task_loader'}, {form: 'submit_task_form'}, {message: 'submit_task_message'}, 'submit_task_popup', 'submit_task_btns']

    show: (data) ->
      @message.html ''
      @submit_task_btns.enable()
      @form.value(data)

    task_submited: (data) ->
      @submit_task_btns.disable()
      @message.html "<p>Вы продали задачу за #{data.score}</p>"

    task_declined: (data) ->
      @submit_task_btns.disable()
      @status_success.show 'Задача снята'