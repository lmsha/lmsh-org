do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.views ||= {}

  class pi.views.UsersSelectView extends pi.views.CommonListView
    constructor: ->
      super [{list:'users_select_list'}, {loader: 'users_select_loader'}, {nod: 'select_users_popup'},{search_field: 'users_search'}], null

    initialize: ->
      super
      @list._create_item = @_list_create_item

    _list_create_item: (data) ->
      item = pi.List::_create_item.call(this, data)
      if @_disabled_ids? and (item.id in @_disabled_ids)
        @selectable.disable_item item
      item

    new: (users) ->
      @list._disabled_ids = if users? then (user.id for user in users) else null
      
      if @list._disabled_ids?
        @list.selectable.disable_item(item) for item in @list.items when (item.id in @list._disabled_ids)

      @_show()

    clear: (data) ->
      super

    close: ->
      @popup.close()

    reset: ->
      @list.selectable.enable_item(item) for item in @list.items
      @list.clear_selection()
      @search_field.reset()

    render_list_data: (data) -> 
      @list.add_item(user,false) for user in data.users 
      @list.update()

    _show: ->
      @popup.open(@nod, align: false, close: "@@cancel")