do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.controllers ||= {}

  class pi.controllers.UsersEdit extends pi.controllers.Base
    constructor: -> 
      @_scope = new pi.utils.Scope()
      super 'users'

    destroy: (items) ->
      false

    save: (data) ->
      false

    cancel: ->
      @view.leftbar.one 'hidden', =>
        @switch_to 'main'
      @view.close()

    switched_from_main: (data) ->
      @view.new()
      return true

    @include pi.modules.Search
