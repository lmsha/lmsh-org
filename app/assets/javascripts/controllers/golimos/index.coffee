do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.controllers ||= {}

  class pi.controllers.Golimos extends pi.controllers.Base
    constructor: -> 
      @_scope = new pi.utils.Scope()
      super 'golimos', 'main', {add_task: new pi.controllers.AddTaskGolimos(), submit_task: new pi.controllers.SubmitTaskGolimos()}

    destroy: (data) ->
      true ## todo: add confirm and destroy

    add_task: (data) ->
      if data?
        @switch_to 'add_task', data

    submit_task: (data) ->
      if data?
        pi.net.get("/golimos/#{data.id}/current_task").then(
          (response) =>
            task = response.task
            data.task_id = task.id
            data.task_name = "#{task.category} №#{task.number} (#{task.form})"
            @switch_to 'submit_task', data
        ).catch(
          (e) => @view.error e.message
        )

    edit: (data) ->
      @goto @_path('edit', data)[0], '_self'

    search: (q) ->
      @view.search q

    sort: (params) ->
      @view.sort params