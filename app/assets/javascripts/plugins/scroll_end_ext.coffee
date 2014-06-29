do (context = this) ->
  "use strict"
  # shortcuts
  $ = context.jQuery
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  # [Plugin]
  # Fires 'scroll_end' event if scroll_end is avaialble and if after list update ('item_removed' or 'update') it's height is less then it's viewport
 
  class pi.ScrollEndExt extends pi.ScrollEnd
    
    enable: ->
      return if @enabled
      super

      @list.on 'update', @update_listener()

    disable: ->
      return unless @enabled
      super

      @list.off 'update', @update_listener()

    update_listener: () ->
      return @_update_listener if @_update_listener?

      @_top = =>
        if @scroll_object is @list.items_cont
          0
        else
          @list.offset().y 

      @_update_listener = debounce 500, (e) =>
        if @list.scroll_end.enabled and (not e.data?.type? or e.data.type is 'item_removed') and (@list.height() + @_top() - @scroll_object.scrollTop() < @scroll_object.height())
          @list.trigger 'scroll_end'