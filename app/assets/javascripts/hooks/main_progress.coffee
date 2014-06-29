pi.Nod.root.ready ->
  nod = $('.main-progress')
  return unless nod?
  nod.style({width: '100%'})
  after 500, ->
    nod.style({opacity: 0})
    after 500, ->
      nod.remove() 