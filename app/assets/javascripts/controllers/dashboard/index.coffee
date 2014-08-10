do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.controllers ||= {}

  class pi.controllers.Dashboard extends pi.controllers.Base
    constructor: -> 
      @_scope = new pi.utils.Scope()
      super 'dashboard', 'main'

    initialize: ->
      super new pi.views.DashboardView()

    destroy: (data) ->
      true ## todo: add confirm and destroy