do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  _form_array_tracker = ''

  class pi.Form extends pi.Base
    initialize: ->
      @former = new FormerJS(@node, serialize: true, rails: true)
      super
    
    value: (val = null) ->
      if val?
        @former.fill(val)
        @trigger 'form_fill'
      else
        @former.parse()

    clear: -> 
      @former.clear()
      @trigger 'form_clear'

