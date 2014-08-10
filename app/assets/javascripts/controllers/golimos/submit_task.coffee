do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.controllers ||= {}

  class pi.controllers.SubmitTaskGolimos extends pi.controllers.Base
    constructor: -> 
      @_scope = new pi.utils.Scope()
      super 'golimos'

    initialize: ->
      super new pi.views.GolimosSubmitTaskView()

    destroy: (items) ->
      false

    save: (data) ->
      false

    close: ->
      @view.popup.close().then( =>
        @exit()
      )

    submit_task: (data) ->
      if data?
        pi.net.post("/golimos/#{data.id}/submit_task", data).then(
          (response) =>
            @view.task_submited(response)
        ).catch(
          (e) =>
            @view.error e.message
        )

    decline_task: (data) ->
      if data?
        pi.net.post("/golimos/#{data.id}/decline_task", data).then(
          (response) =>
            @view.task_declined(response)
        ).catch(
          (e) =>
            @view.error e.message
        )

    switched_from_main: (data) ->
      @view.popup.open(@view.submit_task_popup, align: false, close: => @close())
      @view.show(data)
      return true
