do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  class pi.CheckBox extends pi.Base
    initialize: ->
      @input = @find('.checkbox-input')
      @select() if (@options.selected || @hasClass('is-selected'))
      @on 'click', =>
        @toggle_select()
      super

    select: ->
      unless @selected
        @addClass 'is-selected'
        @selected = true
        @input.value 1
        @trigger 'checked'

    deselect: ->
      if @selected
        @removeClass 'is-selected'
        @selected = false
        @input.value 0
        @trigger 'unchecked'


    toggle_select: ->
      if @selected
        @deselect()
      else
        @select()

    value: (val = null) ->
      @input.value val

