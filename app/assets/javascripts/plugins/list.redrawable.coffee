do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils
   
  # [Plugin]
  # Add ability to redraw nod element of item 

  class pi.Redrawable
    constructor: (@list) ->
      @list.redrawable = this
      @list.delegate ['redraw_item'], 'redrawable'
      return

    # todo: @optimize don't remove nod, but replace innerHtml

    redraw_item: (item) ->
      index = @items.indexOf(item)
      if index > -1
        item.nod.detach()
        delete item.nod
        item = @item_renderer item

        item.nod.data 'listIndex', index

        @items[index] = item

        if index < (@size()-1)
          _after = @items[index+1]   
          _after.nod.insertBefore item.nod
        else
          @items_cont.append item.nod      
      return  