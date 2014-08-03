do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.controllers ||= {}

  class pi.controllers.Tasks extends pi.controllers.Base
    constructor: -> 
      @_scope = new pi.utils.Scope()
      super 'tasks', 'main'

    destroy: (data) ->
      true ## todo: add confirm and destroy

    edit: (data) ->
      @goto @_path('edit', data)[0], '_self'

    search: (q) ->
      @view.search q

    sort: (params) ->
      @view.sort params