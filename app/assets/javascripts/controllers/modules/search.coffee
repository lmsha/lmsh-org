do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.modules||={}

  class pi.modules.Search

    @included: (base) ->
      
      # override next_page for search queries

      if base.next_page?

        # override next_page
        orig = base.next_page
        base.next_page = ->
          if @_scope.params.q
            orig.call(this).then( => @view.searched(@_scope.params.q))
          else
            orig.call(this)

        #override search
        base.search = base.search_paginate

      return

    search_paginate: (query) ->
      if @_loading
          @_queued_query = query
          return
      
      @_queued_query = null

      params = q:query
      @_scope.set params
      if @_scope.is_full
        @view.search query
      else
        @view.before_search()
        utils.debug "last query #{ query }"
        @index().then( => @view.searched(query)).then( => @_check_queue())

    search: (query) ->
      if @_loading
          return
      
      @view.search query

    _check_queue: ->
      if @_queued_query?
        @search @_queued_query