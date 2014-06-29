do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  class pi.SelectAll extends pi.List
    initialize: ->
      pi.event.one 'piecified', (event) =>
        @_attach_list $("#{ @options.list }")
      super

    _attach_list: (@target) ->      
      return if not @target

      @on 'item_click', (e) =>
        @target[e.data.item.action]()
    