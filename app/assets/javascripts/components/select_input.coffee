do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  class pi.SelectInput extends pi.TextInput
    initialize: ->
      @input = @find 'select'
      @placeholder = @find '.selected-placeholder'
      
      if @placeholder?
        @input.on 'change', (e) =>
          @trigger 'change'
          @update_text()

      pi.Base::initialize.apply @
      @update_text()

    update_text: ->
      @placeholder.text @input.node.options[@input.node.selectedIndex].textContent