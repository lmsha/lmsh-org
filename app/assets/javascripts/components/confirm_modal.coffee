do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  class pi.ConfirmModal extends pi.Base
    initialize: ->
      @message_cont = @find('.message')
      super
    
    init: (message, @_submit, @_cancel) ->
      @message_cont.append(message)

    clear: ->
      @message_cont.empty()
      @_cancel = null
      @_submit = null

    cancel: ->
      @_cancel?()

    confirm: ->
      @_submit?()
