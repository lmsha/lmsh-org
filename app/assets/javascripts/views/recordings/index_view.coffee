do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.views ||= {}

  class pi.views.RecordingsView extends pi.views.CommonListView
    constructor: ->
      super [{list:'recordings_list'}, 'loader', 'show_recording_popup', 'show_recording_form','show_recording_list', {confirm:'confirm_modal'}]

    render_list_data: (data) ->
      @list.add_item(recording,false) for recording in data.recordings 
      @list.update()

    show: (data) ->
      @popup.open @show_recording_popup, align: false
      @show_recording_form.value data
      @show_recording_list.data_provider data.participants