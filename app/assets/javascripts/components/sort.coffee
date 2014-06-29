do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  class pi.SortButton extends pi.Button
    initialize: ->
      @state = 
        if @hasClass 'is-sort-desc'
          'desc'
        else if @hasClass 'is-sort-asc'
          'asc'
        else
          ''
      pi.event.one 'piecified', (event) =>
        @_attach_list $("#{ @options.list }")

      super

    _attach_list: (@list) ->      
      @list.on 'sort_update', (event) =>
        if event.data.fields.sort_by != @options.field 
          @toggle()
          @toggle() if event.data.reverse

    toggle: ->
      _state = @state
      @clear()
      @state =
        if _state is 'desc'
          @addClass 'is-sort-asc'
          'asc'
        else
          @addClass 'is-sort-desc'
          'desc'
      @value()

    clear: ->
      if @state is 'desc'
          @removeClass 'is-sort-desc'
        else if @state is 'asc'
          @removeClass 'is-sort-asc'
      @state = ''

    value: ->
      sort_by: @options.field, order: @state

