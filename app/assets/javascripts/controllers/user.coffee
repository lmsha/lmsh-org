do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils


  class pi.User
    constructor: (params) ->
      @[key] = val for own key,val of params
      @fullname = ''+(@name+' ' || '')+(@last_name || '')
