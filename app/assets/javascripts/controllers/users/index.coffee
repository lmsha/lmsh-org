do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.controllers ||= {}

  class pi.controllers.Users extends pi.controllers.Base
    constructor: -> 
      super 'users', 'main'

    destroy: (data) ->
      true ## todo: add confirm and destroy

    new: ->
      @goto @_path('new')[0], '_self'

    edit: (data) ->
      @goto @_path('edit', data)[0], '_self'