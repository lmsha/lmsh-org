do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.controllers ||= {}


  if Function::name? 
    klass_name = ->
      @constructor.name
  else
    klass_name = ->
      _regex = /function (.{1,})\(/
      results = (_regex).exec(@constructor.toString())
      results[1]

  class pi.utils.Scope
    constructor: (@whitelist, @blacklist, @rules={}) ->
      @is_full = false
      @_scope = {}
      @params = {}

    _filter_key: (key) ->
      if @whitelist?
        return @whitelist.indexOf(key) > -1
      if @blacklist?
        return @blacklist.indexOf(key) < 0
      return true

    _merge: (key, val) ->
      if !@is_full
        @_scope[key] = val
      else
        @_scope[key] = @_resolve key, @_scope[key], val

    _resolve: (key, old_val, val) ->
      if !@rules[key]?
        @is_full = false
        val
      else
        _val = @rules[key]?(old_val,val)
        if _val is false
          @is_full = false 
          val
        else
          _val


    set: (params = {}) ->
      (@params[key] = val) for own key, val of params when @_filter_key(key)

      for key, val of @params
        do =>
          if @_scope[key] isnt val
            @_merge(key, val)

    clear: ->
      @params = {}
      @_scope = {}

    to_s: ->
      _ref = []
      _ref.push("#{key}=#{val}") for key, val of @_scope
      _ref.join("&")

    all_loaded: ->
      utils.debug "Scope is full: #{@to_s()}"
      @is_full = true

    reload: ->
      utils.debug "Scope should be reloaded: #{@to_s()}"
      @is_full = false


  class pi.controllers.Base

    @include = (mixins...) ->
      for mixin in mixins
        @::[key] = value for key, value of mixin::
        mixin.included @::
    
    constructor: (@_collection_id, @_context_id = '', @_contexts = {}) ->
      (context._context_id = key) for own key,context of @_contexts

      @_contexts[@_context_id] = this if @_context_id isnt '' 

      pi.event.on 'piecified', => @initialize()

    initialize: () ->      
      @context = this

      _base_name = utils.camelCase(@_collection_id)
      _suffix = @class_name().replace _base_name, ''

      if pi.views["#{_base_name}#{_suffix}View"]?
        @view = new pi.views["#{_base_name}#{_suffix}View"]()
      else
        utils.error "View not found: #{_base_name}#{_suffix}View"

    class_name: klass_name

    switch_context: (from,to,data) ->
      return if @context._context_id is to

      if !@_contexts[to]
        utils.warning "undefined context: #{to}"
        return 

      utils.info "context switch: #{from} -> #{to}"

      @context = @_contexts[to]
      @context.switched from, data
      return true

    switched: (@_from_context, data) ->
      @view.unfreeze()
      return if @["switched_from_#{@_from_context}"]?(data)
      @switched_from_any data

    switched_from_any: ->
      true

    switch_to: (to, data) ->
      if app.page?.switch_context(@_context_id,to,data)
        @view.freeze()

    exit: (data) ->
      @switch_to @_from_context, data

    _path: (action = 'index', params = {}) ->
      {path: path_, method: method} = pi.routes[action]
      [path_.replace(/:collection/,@_collection_id).replace(/:id/,params.id), method]

    _default_resolver: (action) ->
      (response) => 
        @view[action].call(@view, response)
        response

    _action: (action, params, resolver = null) ->

      return if @_loading

      resolver ||= @_default_resolver action

      params ||= (@_scope? && (utils.clone @_scope.params)) 

      params.id ||= @_scope.params.id

      [path, method] = @_path action, params

      delete params.id

      @loading true
      pi.net[method].call(null, path, params)
      .then(resolver)
      .catch( (error) => @view.error error.message )
      .then( (response) =>  
        @loading false 
        response
        )

    loading: (flag) ->
      if @_loading isnt flag
        @_loading = flag
        @view.loading flag

    new: ->
      @view.new()

    reload: ->
      @_scope.reload()
      @index()

    # simply navigate to url
    goto: (url, target = "_self") ->
      window.open(url, target)


  # methods with data

  for method in ['index', 'update', 'create']
    do (method) ->
      pi.controllers.Base::[method] = (params) -> 
        @_action method, params 

  # method requiring only id

  for method in ['show', 'edit',  'destroy']
    do (method) ->
      pi.controllers.Base::[method] = (params) -> 
        @_action method, {id: if params.id? then params.id else params}