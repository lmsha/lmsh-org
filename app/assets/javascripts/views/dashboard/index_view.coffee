do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.views ||= {}

  class pi.views.DashboardView extends pi.views.Base
    constructor: ->
      super ['dashboard']

    initialize: ->
      super
      pi.client.subscribe '/event', (payload) =>
        utils.debug payload
        if payload.event is 'values' 
          @render_data payload.data

    render_data: (data) ->
      @dashboard?.html JST['templates/values'](data)