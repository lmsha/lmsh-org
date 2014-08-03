do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  class pi.StatusMessage extends pi.Base
    initialize: ->
      @delay = @options.delay || 0
      super

    show: (message) ->
      clearTimeout(@_tid) if @_tid? 
      @text message
      super
      after 200, => @activate()
      @_tid = after @delay, => @hide()


    hide: ->
      clearTimeout @_tid
      @deactivate()
      after 200, => super
