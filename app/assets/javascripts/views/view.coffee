do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.views ||= {}

  class pi.views.Base
    constructor: (@components, @global_comps) ->
      @components ||= []
      @global_comps ||= []
      @global_comps.push 'dark_overlay', 'light_overlay', 'popup', 'status_success', 'status_error'
      @initialize()

    initialize: ->
      @_attach_component(component,true) for component in @global_comps 
      @_attach_component(component,) for component in @components 
      true

    freeze: ->
      for own key,value of @components
        do ->
          if value instanceof pi.Base
            value.__was_enabled = value.enabled
            value.disable()

    unfreeze: ->
      for own key,value of @components
        do ->
          if value instanceof pi.Base
            value.enable() if value.__was_enabled
            delete value.__was_enabled

    _attach_component: (component, global = false) ->
      if typeof component is 'string' 
        @[component] = $("@#{ component }")
        @components[component] = @[component] if not global
      else
        for key,val of component
          do =>
            @[key] = $("@#{ val }") 
            @components[key] = @[key] if not global

    loading: (value) ->
      utils.debug "loading is #{ value }"

    success: (message) ->
      @status_success.show message

    error: (message) ->
      utils.error "Error: #{message}"
      @status_error.show message

  for method in ['index', 'show', 'edit', 'update', 'create', 'new', 'destroy']
    do (method) ->
      pi.views.Base::[method] = () -> 
        true