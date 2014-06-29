do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.views ||= {}

  class pi.views.UsersView extends pi.views.CommonListView
    constructor: ->
      super [{list:'users_list'}, 'loader', 'show_user_popup', 'show_user_form', {confirm:'confirm_modal'}]

    render_list_data: (data) ->
      @list.add_item(user,false) for user in data.users 
      @list.update()

    show: (data) ->
      @popup.open(@show_user_popup, align: false)
      @show_user_form.data(data)
      @show_user_list.data_provider data.participants