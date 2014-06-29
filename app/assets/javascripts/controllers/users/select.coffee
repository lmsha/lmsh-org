do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.controllers ||= {}

  class pi.controllers.UsersSelect extends pi.controllers.Base
    
    constructor: -> 
      @_scope = new pi.utils.Scope(null, ['page'], {
        q: (prev,query) ->
          if query.match(prev)?.index == 0
            prev || ''
          else
            false
        })
      super 'users'

    initialize: ->
      super
      after 3000, => @index()

    cancel: ->
      @view.close().then( => 
        @view.reset()
        @exit()
      )

    select_users: ->
      _selected = []
      
      for item in @view.list.selected()
        _item = utils.clone(item,['nod','selected','disabled','role','role_name'])
        _item.changed = 1
        _selected.push _item

      @view.close().then(=> @exit users: _selected)

    switched_from_any: (data) ->
      @view.new data?.users 

    @include pi.modules.Paginated, pi.modules.Search