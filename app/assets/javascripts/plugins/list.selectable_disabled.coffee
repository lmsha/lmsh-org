do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils
   
  # [Plugin]
  # Avoid 'disabled' items from selecting 

  class pi.SelectableDisabled extends pi.Selectable

    item_click_handler: ->
      return @_item_click_handler if @_item_click_handler
      @_item_click_handler = (e) =>
        return if e.data.item.disabled
        if @type.match('radio') and not e.data.item.selected
          @list.clear_selection(true)
          @list._select e.data.item
          @list.trigger 'selected'
        else if @type.match('check')
          @list._toggle_select e.data.item
          if @list.selected().length then @list.trigger('selected') else @list.trigger('selection_cleared')
        return      

    select_all: () ->
      @_select(item) for item in @items when not item.disabled
      @trigger('selected') if @selected().length

    _select: (item, force = false) ->
      return if not force and item.disabled
      super
      
    _deselect: (item, force = false) ->
      return if not force and item.disabled
      super

    disable_item: (item) ->
      unless item.disabled
        item.disabled = true
        item.nod.addClass 'is-disabled'

    enable_item: (item) ->
      if item.disabled
        delete item.disabled
        item.nod.removeClass 'is-disabled'