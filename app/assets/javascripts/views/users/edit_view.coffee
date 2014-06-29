do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.views ||= {}

  class pi.views.UsersEditView extends pi.views.CommonListView
    constructor: ->
      super [{list:'add_users_list'}], null

    initialize: ->
      super

    new: ->
      @_show()

    edit: (data) ->
      false

    destroy: (items) ->
      false

    clear: (data) ->
      super
      @form.clear()

    close: ->
      @leftbar.hide()

    _show: ->
      @leftbar.one 'hidden', =>
        after 500, => @clear()
      @leftbar.show()