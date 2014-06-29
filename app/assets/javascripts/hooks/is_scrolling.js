// is-scrolling

(function(){
  var timer = null

  pi.NodEvent.add(window,'scroll',function(){
    
    timer && clearTimeout(timer);

    timer = setTimeout(function(){
      document.body.classList.remove('is-scrolling')
      timer = null;
    }, 200);

    document.body.classList.add('is-scrolling')
  });
})();