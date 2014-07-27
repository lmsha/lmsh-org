do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.views ||= {}

  class pi.views.GolimosView extends pi.views.CommonListView
    constructor: ->
      super [{list:'users_list'}, 'loader', 'show_user_popup', 'new_user_popup', 'show_user_form', {confirm:'confirm_modal'}]

    render_list_data: (data) ->
      @list.add_item(user,false) for user in data.golimos 
      @list.update()

    show: (data) ->
      @popup.open(@show_user_popup, align: false)
      @show_user_form.data(data)
      @show_user_list.data_provider data.participants

    "new": ->
      @popup.open(@new_user_popup) 