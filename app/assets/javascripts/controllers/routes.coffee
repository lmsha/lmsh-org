do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.routes =
    index: 
      path: '/api/:collection'
      method: 'get'
    edit: 
      path: '/api/:collection/:id/edit'
      method: 'get'
    show:
      path: '/api/:collection/:id'
      method: 'get'
    create: 
      path: '/api/:collection'
      method: 'post'
    update: 
      path: '/api/:collection/:id'
      method: 'patch'
    destroy: 
      path: '/api/:collection/:id'
      method: 'delete'
    participants:
      path: '/api/:collection/:id/participants'
      method: 'get'

