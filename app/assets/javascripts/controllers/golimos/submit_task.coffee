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

    destroy: (items) ->
      false

    save: (data) ->
      false

    close: ->
      @view.popup.close().then( =>
        @exit()
      )

    switched_from_main: (data) ->
      @view.popup.open(@view.submit_task_popup, align: false, close: => @close())
      @view.show(data)
      return true
