do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.controllers ||= {}

  class pi.controllers.MeetingsEdit extends pi.controllers.Base
    constructor: -> 
      @_scope = new pi.utils.Scope(null, ['page'], {
        q: (prev,query) ->
          if query.match(prev)?.index == 0
            prev || ''
          else
            false
        })
      super 'meetings'

    destroy: (items) ->
      @view.destroy items

    select_roles: (data) ->
      utils.debug data
      if data.role?
        @view.update_role @view.list.selected(), data.role
      @view.list.clear_selection()
      @view.popup.close()

    save: (data) ->
      _action = if data.meeting.id? then 'update' else 'create' 
      
      ## fixme temporary 

      data.meeting.started_at_time = data.meeting.started_at_hour+':'+data.meeting.started_at_minute
      data.meeting.started_at_date = data.meeting.started_at_year+'-'+data.meeting.started_at_month+'-'+data.meeting.started_at_day

      (delete data.meeting[key]) for key in ["started_at_hour","started_at_minute","started_at_month","started_at_year","started_at_day"]

      @[_action](data).then((data) => 
          @view.close()
          @switch_to('main',data)
          )
            
    cancel: ->
      @view.leftbar.one 'hidden', =>
        @switch_to 'main'
      @view.close()

    add_users: ->
      @switch_to 'select_users', users: @view.list.items

    switched_from_main: (data) ->
      @_scope.clear()
      if data?
        @view.edit data
        @_scope.set id: data.id, skip_paginate: 1
        @participants()
      else 
        @view.new()
        @view.participants users: [{id: app.user.id, fullname: app.user.fullname, email: app.user.email, role: 2}]
    
      return true

    participants: ->
      @_action 'participants'

    switched_from_select_users: (data) ->
      if data?
        @view.participants data
      return true

    @include pi.modules.Search
