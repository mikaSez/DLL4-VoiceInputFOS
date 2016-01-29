

	var Visualizer = function(can, audio,conf){
		var canvas = can;
		var audioCtx = audio;
		var canvasCtx;
		var analyser = audioCtx.createAnalyser();
		var config = conf || { };
		var animation;
		var bufferLength = config.bufferLength || 1024;

		var dataArray = new Uint8Array();
		var worker = new Worker("js/visualizerWorker.js");



		worker.onmessage = function(event){
			switch(event.data.command) {
				case 'process': 
				console.info(event.data);
				dataArray = Uint8Array.from(event.data.data);
				console.info(dataArray);
				console.log("new buffer recieved");
				break;
				case  'stop':
				cancelAnimationFrame(animation);
				dataArray = new Uint8Array();
				draw();
				console.info("stop order recieved");
				break;
				case  'start':
				update();
				console.info("start order recieved");
				break;
		}
		};
		var init = function(){
			console.info("initialization of DOM elements of the visualizer");
			 if(!!!canvas){
			 	canvas = document.getElementById("canvas");
			 }
			 canvasCtx = canvas.getContext('2d');
			 analyser.fftSize = 2048;
		}
		
		

		 
	    var draw = function() {  
		    canvasCtx.save();  
		   
		    analyser.getByteTimeDomainData(dataArray);
		    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
		    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
		    canvasCtx.lineWidth = 1;

		    var gradient=canvasCtx.createLinearGradient(0,0,170,0);
			gradient.addColorStop("0","magenta");
			gradient.addColorStop("0.5","blue");
			gradient.addColorStop("1.0","red");

		    canvasCtx.strokeStyle = gradient;
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
	  	draw()
	  	animation = requestAnimationFrame(update);  
	  }
	  var getWorker = function(){
	  	return worker;
	  }
	  var stream = function(source){
	  		source.connect(analyser);
	  }
	  return {
	  	 update,
	  	 init,
	  	 getWorker,
	  	 stream
	  };
	}

