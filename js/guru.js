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
    url: 'https://script.google.com/macros/s/AKfycbz4nhciVHtLjWJjNqeCodG7MFE4NGCY45S5zI--9BftHoQDovFCX88osy7WDqEOeQqn9w/exec',
    cors: true,
    head: 'Software Failure. &nbsp; Touch / ESC / LMB to continue.',
    css: 'guru{position:fixed;z-index:604;top:0;left:0;background:black;color:red;font:1.5vw monospace;display:block;text-align:center;width:calc(100% - 24px);padding:6px;border:6px solid #000;animation:blink .5s step-end infinite alternate;}@keyframes blink {50%{border-color:#F00;}}',
    ref: null,
    display: function(msg, url, line, col, err){
      var mobileURL = 0 // how many pixels are used by URL address bar
      /* Lessons learned:
        Tablet, mobile and macOS... or more easy only Win Browser does zoom different
        fixed is a problem here... change to absolute? looks like i need the resize/onscroll handler anyway :(
      //var mobileURL = (window.visualViewport) ? (window.innerHeight - window.visualViewport.height) : 0 // else guru bar is behind URL on mobile
      // ToDo: problem when zoomed on mobile
      //mobileURL *= devicePixelRatio
      //console.log(window.innerHeight, window.visualViewport.height)
      // oops more problem then expected... ha ha
      // ToDo: Zoom, but only mobile and tablets ... Yeah!
      var userAgent = navigator.userAgent.toLowerCase()
      var isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent)
      var isMobile = /mobi/i.test(userAgent)
      var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
      var isMacLike = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)?true:false;
      var isIOS = navigator.platform.match(/(iPhone|iPod|iPad)/i)?true:false;

      var zoom = 1
      if (typeof visualViewport !== 'undefined') zoom = (innerWidth / visualViewport.width)
      if (isMobile) {
        //mobileURL = (visualViewport) ? (innerHeight - visualViewport.height) : 0 // else guru bar is behind URL on mobile
      }
      //alert('nonZoom\ndevicePixelRatio '+ devicePixelRatio +'\nmobileURL '+ mobileURL+'\ninnerHeight '+innerHeight +'\nvisualViewport '+visualViewport.height +'\nzoom '+zoom+'\nisMobile '+isMobile+'\nisTablet '+isTablet)
      console.log('nonZoom\ndevicePixelRatio '+ devicePixelRatio +'\nmobileURL '+ mobileURL+'\ninnerHeight '+innerHeight +'\nzoom '+zoom+'\nisMobile '+isMobile+'\nisTablet '+isTablet+'\nisMac '+isMac+'\nisMacLike '+isMacLike+'\nisIOS '+isIOS)
      */

      var t = ['<guru style="top:'+mobileURL+'px"><style>']
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
      Guru.ref = document.getElementsByTagName('guru')[0]

      // add handler to quit msg
      // should not only be mouse, also touch and keyboard or generally configurable?
      addEventListener('keydown',Guru.keyHandler)
      addEventListener('mousedown',Guru.mouseHandler)
      addEventListener('touchstart',Guru.touchHandler)

      /*
      addEventListener('resize',Guru.resizer)
      addEventListener('scroll',Guru.resizer)
      addEventListener('orientationchange',Guru.resizer)
      Guru.resizer()
      */
    },
    hide: function(msg){
      document.body.removeChild(Guru.ref)
      Guru.ref = null
      
      // remove event listeners
      removeEventListener('keydown',Guru.keyHandler)
      removeEventListener('mousedown',Guru.mouseHandler)
      removeEventListener('touchstart',Guru.touchHandler)
      
      /*
      removeEventListener('resize',Guru.resizer)
      removeEventListener('scroll',Guru.resizer)
      removeEventListener('orientationchange',Guru.resizer)
      */
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
      Guru.hide()
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
          Guru.ref.getElementsByTagName('span')[0].innerText = 'Error sending report.'
        }catch(e){}
      }

      xhr.send( JSON.stringify(dat) )
    },
    /*
    resizer: function(){
      if (!Guru.ref) return // no ui
      Guru.ref.style.top = scrollY +'px'
    },
    */
  }
  
  //
  // error handler
  //
  onerror = function(msg, url, line, col, err){

    try { // try catch to prevent getting stuck in an endless loop

      // crossorigin check
      /*
      if (msg.toLowerCase().indexOf('script error') > -1) {
        console.log('CORS')
        Guru.cors = true // ToDo : check if this works
      }
      */

      // Server
      if (Guru.send && Guru.cors) {

        // send error
        Guru.post(Guru.url, {
          msg: msg,
          url: url,
          line: line,
          col: col,
          stack: err.stack,
          agent: navigator.userAgent,
          screen: screen.width+'x'+screen.height+'x'+screen.colorDepth,
          window: innerWidth+'x'+innerHeight+'@'+devicePixelRatio,
        }, function(ret){
          try { // handles both, display yes/no and already closed
            var j = JSON.parse(ret.responseText)
            var suc = (j && j.status && j.status == "OK") ? true : false
            Guru.ref.getElementsByTagName('span')[0].innerText = (suc) ? 'Report was sent.' : 'Error sending report.'
          }catch(e){}
        })
      }

      // Client         
      if (Guru.show && !Guru.ref) {
        Guru.display(msg, url, line, col, err)
      }
      
    }catch(e){
      console.error('Error while error handling')
    }
    
    return false
  }
    
})()
