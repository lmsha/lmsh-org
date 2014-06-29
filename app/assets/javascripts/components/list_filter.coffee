do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  class pi.ListFilter extends pi.List
    initialize: ->
      @options.plugins || = []
      @options.plugins.push "selectable"
      super
    
    value: ->
      item = @selected_item()
      item?.type