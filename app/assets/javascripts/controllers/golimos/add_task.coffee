do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.controllers ||= {}

  class pi.controllers.AddTaskGolimos extends pi.controllers.Base
    constructor: -> 
      @_scope = new pi.utils.Scope()
      super 'golimos'

    initialize: ->
      super new pi.views.GolimosAddTaskView()

    destroy: (items) ->
      false

    create_task: (data) ->
      if data?
        pi.net.post("/golimos/#{data.id}/buy_task", data).then(
          (response) =>
            @view.task_assigned(response.task)
        ).catch(
          (e) =>
            @view.error e.message
        )

    close: ->
      @view.popup.close().then( =>
        @exit()
      )

    switched_from_main: (data) ->
      @view.popup.open(@view.add_task_popup, align: false, close: => @close())
      @view.show(data)
      return true
