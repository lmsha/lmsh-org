pi.client = new Faye.Client('/faye')

pi.client.subscribe '/event', (payload)->
  pi.utils.debug payload