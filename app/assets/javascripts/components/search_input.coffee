do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  class pi.SearchInput extends pi.TextInput
    initialize: ->
      super
      @find('.fa').on 'click', =>
        @reset()

      @input.on 'keyup', debounce(300,@_query,this)

    _query: ->
      @activate() if !@active
      val = @input.value()

      utils.debug "query: #{ val }"
      
      @trigger 'query', val

      @deactivate() if !val

    reset: ->
      @value('')
      @deactivate()
      @trigger 'query', ''