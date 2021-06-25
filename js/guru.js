/*
  Guru Meditation by DrSnuggles
  Designed as single script which also includes CSS
*/
'use strict';

(function(){

  //
  // Configurable object
  //
  window.Guru = {
    show: true,
    send: true,
    url: 'https://script.google.com/macros/s/AKfycbwIDY4Dmka0VoXDp-MRIpptVEKGcyjQkph5tKR5mLWP7is2LYvwN-C0Nk95VoCAwANFow/exec',
    cors: true,
    head: 'Software Failure. &nbsp; Touch / ESC / LMB to continue.',
    css: 'guru{position:fixed;top:0;left:0;background:black;color:red;font:1.5vw monospace;display:block;text-align:center;width:calc(100% - 24px);padding:6px;border:6px solid #000;animation:blink .5s step-end infinite alternate;}@keyframes blink {50%{border-color:#F00;}}',
    display: function(msg, url, line, col, err){
      var t = ['<guru><style>']
      t.push(Guru.css)
      t.push('</style><div>')
      t.push(Guru.head)
      if (Guru.send) {
        if (Guru.cors) {
          t.push(' &nbsp; <span>Sending report.</span>')
        } else {
          t.push(' &nbsp; Cannot sent (CORS).')
        }
      }
      t.push('</div><div>')
      t.push('Guru Meditation: ')
      //t.push(err.stack) // stack can be very long
      t.push(url +':'+ line)
      t.push('</div></guru>')
      
      document.body.insertAdjacentHTML('beforeEnd',t.join(''))

      // add handler to quit msg
      // should not only be mouse, also touch and keyboard or generally configurable?
      window.addEventListener('keydown',Guru.keyHandler)
      window.addEventListener('mousedown',Guru.mouseHandler)
      window.addEventListener('touchstart',Guru.touchHandler)
    },
    hide: function(msg){
      var guru = document.getElementsByTagName('guru')[0]
      document.body.removeChild(guru)
      
      // remove event listeners
      window.removeEventListener('keydown',Guru.keyHandler)
      window.removeEventListener('mousedown',Guru.mouseHandler)
      window.removeEventListener('touchstart',Guru.touchHandler)
      
    },
    keyHandler: function(ev){
      var catched = false
      if (ev.keyCode === 27) { // ESC
        Guru.hide()
        catched = true
      }
      if (catched) ev.preventDefault()
    },
    mouseHandler: function(ev){
      var catched = false
      if (ev.buttons === 1) { // LMB
        Guru.hide()
        catched = true
      }
      if (catched) ev.preventDefault()
    },
    touchHandler: function(ev){
      console.log(ev) // ToDo
    },
    post: function(url, dat, cb) {
      // IE11 compatible, no fetch :(

      var xhr = new XMLHttpRequest()
      if (typeof XSLTProcessor === 'undefined') {
        try {xhr.responseType = 'msxml-document'} catch(e) {} // Helping IE11
      }
      
      xhr.open('POST', url, true)
      xhr.onload = function() {
        if (cb) cb( this )
      }
      xhr.onerror = function(){
        try { // handles both, display yes/no and already closed
          document.getElementsByTagName('guru')[0].getElementsByTagName('span')[0].innerText = 'Error sending report.'
        }catch(e){}
      }

      xhr.send( JSON.stringify(dat) )
    },
  }
  
  //
  // error handler
  //
  onerror = function(msg, url, line, col, err){

    try { // try catch to prevent getting stuck in an endless loop

      // crossorigin check
      if (msg.toLowerCase().indexOf('script error') > -1) {
        console.log('CORS')
        Guru.cors = true // ToDo : check if this works
      }

      // Server
      if (Guru.send && Guru.cors) {

        // send error
        Guru.post(Guru.url, {
          msg: msg,
          url: url,
          line: line,
          col: col,
          stack: err.stack,
        }, function(ret){
          try { // handles both, display yes/no and already closed
            var j = JSON.parse(ret.responseText)
            var suc = (j && j.status && j.status === "OK") ? true : false
            document.getElementsByTagName('guru')[0].getElementsByTagName('span')[0].innerText = suc ? 'Report was sent.' : 'Error sending report.'
          }catch(e){}
        })
      }

      // Client
      if (Guru.show && document.getElementsByTagName('guru').length === 0) {
        Guru.display(msg, url, line, col, err)
      }
      
      err.cancelBubble = true
    }catch(e){
      console.error('Error while error handling')
    }
    
    return false
  }
    
})()
