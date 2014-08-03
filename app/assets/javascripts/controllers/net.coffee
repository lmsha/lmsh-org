do (context = this) ->
  "use strict"
  # shortcuts
  pi = context.pi  = context.pi || {}
  utils = pi.utils

  pi.net = 
    request: (method, url, data, xhr = null) ->
      new Promise( 
        (resolve, reject) ->
          req = xhr || new XMLHttpRequest()
          
          _headers = {'X-CSRF-Token': context.AUTH_TOKEN}

          if method is 'GET'
            params = []
            if data?
              params.push("#{ key }=#{ encodeURIComponent(val) }") for own key, val of data
            url+="?#{ params.join("&") }"
            data = null
          else
            _headers['Content-Type'] = 'application/json'
            data = JSON.stringify(data) if data?

          req.open method, url, true

          req.setRequestHeader(key,value) for own key,value of _headers

          _headers = null

          req.onreadystatechange = ->

            return if req.readyState isnt 4 

            if req.status == 200
              type = req.getResponseHeader 'Content-Type'
              
              response = 
                if /json/.test type
                  JSON.parse req.responseText
                else
                  req.responseText
              
              resolve response
            else
              reject Error(req.responseText)

  
          req.onerror = ->
            reject Error("Network Error")
            return
      
          req.send(data)
          )
    
  pi.net[method] = curry(pi.net.request, [method.toUpperCase()], null) for method in ['get', 'post', 'patch', 'delete']
