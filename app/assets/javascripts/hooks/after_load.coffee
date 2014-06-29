pi.Nod.root.ready ->
  pi.Nod.root.each('.after-load', (node) ->
    node.classList.remove 'after-load')