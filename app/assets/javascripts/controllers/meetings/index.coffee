do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.controllers ||= {}

  class pi.controllers.Meetings extends pi.controllers.Base
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
      super 'meetings', 'main', {edit: new pi.controllers.MeetingsEdit(), select_users: new pi.controllers.UsersSelect()}

    initialize: ->
      super
      @index()

    destroy: (data) ->
      data = utils.clone data, ['nod']
      @view.confirm.init(
        JST['templates/meetings/destroy_confirm'](data), 
        (=> 
          @view.popup.close()
          @_action('destroy',data).then(=> @reload())), 
        => @view.popup.close()
        )
      @view.popup.open(@view.confirm)

    filter: (type) ->
      @_scope.set filter: type
      @paginate()

    sort: (params) ->
      @_scope.set params
      if @_scope.is_full
        @view.sort(params)        
      else
        @view.sorted()
        @paginate().then( => @view.sorted(params.sort_by, params.order == 'asc'))

    new: ->
      @switch_to 'edit'

    edit: (data) ->
      @switch_to 'edit', data

    switched_from_edit: (data) ->
      if data?
        @reload()  

    @include pi.modules.Paginated, pi.modules.Search