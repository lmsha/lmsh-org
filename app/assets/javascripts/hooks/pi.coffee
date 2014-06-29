
window.app = pi._storage.app = pi.app = {};


# override str_to_fun to handle page calls

_orig = pi.str_to_fun

pi.str_to_fun = (callstr, host = null) ->
  if callstr[0..1] is '@@'
    callstr = "@app.page.context." + callstr[2..] 
  _orig callstr, host  

pi.Nod.root.ready ->
  pi.piecify()