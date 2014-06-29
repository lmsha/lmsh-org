do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.views ||= {}

  class pi.views.CommonListView extends pi.views.Base
    constructor: ->
      super

    initialize: ->
      super
      unless @list.jst_renderer
        @list.item_renderer = (item) ->
          res = utils.clone item
          res.nod = $(item.nod)
          res

    loading: (flag) ->
      if flag
        @loader.reset()
        @loader.start()
      else
        @loader.stop()

    sort: (params) ->
      {sort_by: field, order: order} = params
      @list.sort(field,order == 'asc')        

    sorted: (field, reverse) ->
      @list.trigger 'sort_update', {fields: field, reverse: reverse}

    before_search: ->
      @list._start_search()

    search: (query) ->
      @list.search query, true

    searched: (query) ->
      utils.debug "loaded search #{query}"
      @list._all_items = utils.clone @list.items
      @list.search query, true 

    clear: (data) ->
      utils.debug 'clear list'
      @list.clear()
      @list.scroll_end?.disable()

    index: (data) ->
      unless data.pagination?.next_page?
        @list.scroll_end?.disable()
      else if not @list.scroll_end?.enabled
        @list.scroll_end.enable()

      @render_list_data(data)

    render_list_data: ->