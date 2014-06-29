do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  class pi.LoadProgress extends pi.Base
    start: (target) ->
      @value = 0
      if target? and target.hasOwnProperty('onprogress')
        target.onprogress = (event) =>
          utils.debug "Progress #{event.lengthComputable}: #{event.loaded} / #{event.total}"
          if event.lengthComputable
            @set  (100*event.loaded / event.total)|0
      else
        @simulate()

      @show()

    set: (value) ->
      @value = value
      @style(width: "#{value}%")

    simulate: ->
      @_sid = after 200, =>
                @set (@value + (100 - @value)/2) 
                @simulate()
    reset: ->
      @_sid && clearTimeout(@_sid)
      @style(width: 0)
      @hide()

    stop: ->
      @_sid && clearTimeout(@_sid)
      @style(width: "101%")
      after 200, =>
        @style(width: 0)
        @hide()