do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.views ||= {}

  class pi.views.MeetingsEditView extends pi.views.CommonListView
    constructor: ->
      super [{list:'participants_list'}, {loader: 'edit_loader'}, {form: 'leftbar_form'}], null

    initialize: ->
      super

    new: ->
      @_show()

    edit: (data) ->
      @form.value meeting: data
      @_show()

    destroy: (items) ->
      @list.remove_item(item,false) for item in items
      @list.update() 

    update_role: (items, role) ->
      for item in items
        item._old_role ||= item.role
        item.role = role
        item.changed = true if item._old_role != role
        @list.redraw_item item
      return

    clear: (data) ->
      super
      @form.clear()

    close: ->
      @leftbar.hide()
     

    participants: (data) -> 
      @list.add_item(user,false) for user in data.users 
      @list.update()


    _show: ->
      @leftbar.one 'hidden', =>
        after 500, => @clear()
      @leftbar.show()