do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.views ||= {}

  class pi.views.MeetingsView extends pi.views.CommonListView
    constructor: ->
      super [{list:'meetings_list'}, 'loader', 'show_meeting_popup', 'show_meeting_form','show_meeting_list', {confirm:'confirm_modal'}]

    render_list_data: (data) ->
      @list.add_item(meeting,false) for meeting in data.meetings 
      @list.update()

    show: (data) ->
      @popup.open @show_meeting_popup, align: false
      @show_meeting_form.value data
      @show_meeting_list.data_provider data.participants