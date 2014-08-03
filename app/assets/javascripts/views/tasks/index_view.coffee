do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.views ||= {}

  class pi.views.TasksView extends pi.views.CommonListView
    constructor: ->
      super [{list:'tasks_list'}, {confirm:'confirm_modal'}]

    render_list_data: (data) ->
      @list.add_item(task,false) for task in data.tasks
      @list.update()