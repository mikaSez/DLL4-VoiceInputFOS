window.addEventListener("load", function() {
  navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);
var audio = document.createElement("audio");
audio.setAttribute("controls", true);


   
  
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser();
  
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  
  
  var canvas = document.getElementById('canvas');
  var canvasCtx = canvas.getContext('2d');
  canvasCtx.clearRect(0, 0, canvas.width , canvas.height);
 
    var draw = function() {
    drawVisual = requestAnimationFrame(draw);

      
    canvasCtx.save();  
    analyser.getByteTimeDomainData(dataArray);
    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasCtx.beginPath();
    var sliceWidth = canvas.width * 1.0 / bufferLength;
    var x = 0;
      
    for(var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = v * canvas.height/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }
    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke(); 
    canvasCtx.restore();
  };


  function startMedia() {
    try {
      window.navigator.mozGetUserMedia({audio:true}, function(stream) {   
        document.body.appendChild(audio);
        audio.mozSrcObject = stream;
        audio.play();
        var source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);  
        document.getElementById("sendKey").style="display:none;";
        document.getElementById("canvas").style="display:block;";
        draw();
      }, function (err) {
       console.error(err);
     });
    } catch(e) {
      console.error(err);
    }
  }

  window.draw = startMedia;
});

window.draw = function(){}
