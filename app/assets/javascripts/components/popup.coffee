do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  class pi.Popup extends pi.Base

    resize_handler: ->
        return @_resize_handler if @_resize_handler
        @_resize_handler = (e) =>
            return if !@target
            th = @target.height()
            wh = pi.Nod.root.height()

            y = if th < wh then (wh - th) / 2 else 0

            @target.top y

    # Show target in popup
    # @params [pi.Base] target
    # @params [Obejct] options 

    open: (@target, @options = {}) ->
        if @_is_open
            utils.warning 'Trying to popup over popup!'
            return

        @target_parent = @target.parent()

        @append @target
        @show()

        unless @options.align is false 
            after 50, => @resize_handler()()
            pi.NodEvent.add window, "resize", @resize_handler()

        @target.addClass 'is-popup'

        @target.show()

        @_is_open = true
        @trigger 'opened'

    handle_close: ->
        unless @options.close?
            @close() 
            return
            
        return if @options.close is false

        if typeof @options.close is 'function'
            @options.close.call null
        else
            pi.str_to_fun(@options.close)() 


    close: (target) ->
        new Promise(
            (resolve,reject) =>
                if not @target
                    reject Error('popup is empty')
    
                if (target && (target != @target)) 
                    reject Error('wrong target')
        
                # .5s - transition delay

                after 500, => 
                    @target.hide()
                    @target.removeClass 'is-popup'
                    @target_parent.append @target
                    @target = null
                    @target_parent = null
                    @_is_open = false
                    unless @options.align is false 
                        pi.NodEvent.remove window,"resize", @resize_handler()
                    
                    resolve()

                @hide()
        ).then( => @trigger 'closed')