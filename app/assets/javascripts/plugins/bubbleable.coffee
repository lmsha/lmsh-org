do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  # [Plugin]
  # Fires 'scroll_end' event if scroll_end is avaialble and if after list update ('item_removed' or 'update') it's height is less then it's viewport
 
  class pi.Bubbleable
    constructor: (@target) ->
      @target.bubbleable = this
      @bubbling = false
      @scroll_object = pi.Nod.root
      pi.Nod.win.on 'scroll', @scroll_listener()
      return

    scroll_listener: ->
      @_scroll_listener ||= debounce 200, (event) =>
        if @target.y() <= @scroll_object.scrollTop()
          @start_bubbling()
        else
          @stop_bubbling()

    start_bubbling: ->
      unless @bubbling
        @target.addClass 'is-bubbling'
        @bubbling = true

    stop_bubbling: ->
      if @bubbling
        @target.removeClass 'is-bubbling'
        @bubbling = false