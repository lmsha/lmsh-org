do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.views ||= {}

  class pi.views.GolimosSubmitTaskView extends pi.views.Base
    constructor: ->
      super [{'loader':'submit_task_loader'}, {form: 'submit_task_form'}, 'submit_task_popup']

    show: (data) ->
      @form.value(data)