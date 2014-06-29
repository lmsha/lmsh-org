do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.controllers ||= {}

  class pi.controllers.Recordings extends pi.controllers.Meetings
    constructor: -> 
      @_scope = new pi.utils.Scope(null, ['page'], {
        q: (prev,query) ->
          if query.match(prev)?.index == 0
            prev || ''
          else
            false
        sort_by: ->
          true
        order: ->
          true
        })
      pi.controllers.Base::constructor.call @, 'recordings', 'main', {edit: new pi.controllers.MeetingsEdit(), select_users: new pi.controllers.UsersSelect()}

    #bypass reloading on edit
    switched_from_edit: ->
      true