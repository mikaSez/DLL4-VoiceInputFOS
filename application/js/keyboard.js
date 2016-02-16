var inputContext = null;
var keyboardElement;

function init() {
  keyboardElement = document.getElementById('keyboard');
  if(window.navigator.mozInputMethod){
      window.navigator.mozInputMethod.oninputcontextchange = function() {
      inputContext = navigator.mozInputMethod.inputcontext;
      resizeWindow();
      };
  }


  window.addEventListener('resize', resizeWindow);

  keyboardElement.addEventListener('mousedown', function onMouseDown(evt) {
  // Prevent loosing focus to the currently focused app
  // Otherwise, right after mousedown event, the app will receive a focus event.
    evt.preventDefault();
  });
    
  var switchElement = document.getElementById('switchLayout');
  var sendKeyElement = document.getElementById('switchAudio');
  var switchIcon = document.getElementById("switch-icon");
  
  sendKeyElement.addEventListener('click', function sendKeyHandler() {
      if(sendKeyElement.className.indexOf("start")!=-1){
          sendKeyElement.className = "stop";
          switchIcon.className="icon-mute";
          switchElement.className = "stopLayout"
          setTimeout(function () {
                switchElement.className += ' removed';
        }, 3000);
      } else {
          sendKeyElement.className = "start";
          switchIcon.className="icon-mic";       
          switchElement.className = "startLayout"
      }
    
  });

  switchElement.addEventListener('click', function switchHandler() {
    var mgmt = navigator.mozInputMethod.mgmt;
    mgmt.next();
  });

  // long press to trigger IME menu
  var menuTimeout = 0;
  switchElement.addEventListener('touchstart', function longHandler() {
    menuTimeout = window.setTimeout(function menuTimeout() {
      var mgmt = navigator.mozInputMethod.mgmt;
      mgmt.showAll();
    }, 700);
  });

  switchElement.addEventListener('touchend', function longHandler() {
    clearTimeout(menuTimeout);
  });
}

function resizeWindow() {
  window.resizeTo(window.innerWidth, keyboardElement.clientHeight);
}

function sendKey(keyCode) {
  switch (keyCode) {
  case KeyEvent.DOM_VK_BACK_SPACE:
  case KeyEvent.DOM_VK_RETURN:
    if (inputContext) {
      inputContext.sendKey(keyCode, 0, 0);
    }
    break;

  default:
    if (inputContext) {
      inputContext.sendKey(0, keyCode, 0);
    }
    break;
  }
}

window.addEventListener('load', init);