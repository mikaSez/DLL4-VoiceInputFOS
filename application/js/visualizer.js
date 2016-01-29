
	function messageHandler(event) {
	    // On récupère le message envoyé par la page principale
	    var messageSent = event.data;
	    // On prépare le message de retour
	    var messageReturned = "Bonjour " + messageSent + " depuis un thread séparé !";
	    // On renvoit le tout à la page principale
	    this.postMessage(messageReturned);
	    console.info(messageReturned);
	}

	// On définit la fonction à appeler lorsque la page principale nous sollicite
	// équivalent à this.onmessage = messageHandler;
	this.addEventListener('message', messageHandler, false);

	var Visualizer = function(can, audio, conf){
		var canvas = can;
		var audioCtx = audio;
		var canvasCtx = canvas.getContext('2d');
		var analyser = audioCtx.createAnalyser();
		var config = conf || { };
		var bufferLength;
		var dataArray;
		var worker;

		var init = function(){
			 canvasCtx = canvas.getContext('2d');
			 analyser = audioCtx.createAnalyser();
			 config = conf || { };
			 analyser.fftSize = config.fftSize || 2048 ;
			 bufferLength = analyser.frequencyBinCount;
			 dataArray = new Uint8Array(bufferLength);
			 draw();
		}
		
		

		 
	    var draw = function() {  
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

	  var update = function(){
	  	requestAnimationFrame(draw);  
	  }
	  var getWorker = function(){
	  	return worker;
	  }
	  return {
	  	update : update,
	  	init : init,
	  	worker : getWorker
	  };
	}
