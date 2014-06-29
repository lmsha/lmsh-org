do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.modules||={}

  class pi.modules.Paginated

    @included: (base) ->
      base.index = base.paginate 
      return

    _page_resolver: ->
      (response) =>
        @_next_page = response.pagination.next_page
        @_scope.all_loaded() if !@_next_page            
        @view.clear() if response.pagination.current_page == 1
        @view.index response
        response

    next_page: ->
      params = utils.clone @_scope.params
      params.page = @_next_page || 1
      @paginate params

    paginate: (params) ->
      if @_scope.is_full
        utils.debug "Nothing to load: #{@_scope.to_s()}"
        return

      params ||= utils.clone @_scope.params

      params.page ||= 1

      @_action (@_paginate_action||'index'), params, @_page_resolver()