

	var Visualizer = function(can, audio,conf){
		var canvas = can;
		var audioCtx = audio;
		var canvasCtx;
		var analyser = audioCtx.createAnalyser();
		var config = conf || { };
		var animation;
		var bufferLength = config.bufferLength || 1024;
        var lastSoundWaves = [];
        var numberSoundWavesKeep = 2;
        var skipWaves = 50;
        var currentWaves = 1;
        
		var dataArray = new Uint8Array();
		var worker = new Worker("js/visualizerWorker.js");

        var Point = function(pointX, pointY){
            
            var x = pointX;
            var y = pointY;
            
            return {
                x,y
            };
        }
        
		worker.onmessage = function(event){
			switch(event.data.command) {
				case 'process': 
				console.info(event.data);
				dataArray = Uint8Array.from(event.data.data);
				console.info(dataArray);
				console.log("new buffer received");
				break;
				case  'stop':
				cancelAnimationFrame(animation);
				dataArray = new Uint8Array();
				draw();
				console.info("stop order received");
				break;
				case  'start':
				update();
				console.info("start order received");
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
		
		
        
        function pushSoundWave(points){
            currentWaves++;
            if(currentWaves%skipWaves==0){
                 if(lastSoundWaves.length >= numberSoundWavesKeep){
                     lastSoundWaves.pop();
                }
                lastSoundWaves.push(points);     
            }
             
        }

		 
	    var draw = function() {  
            var soundWave = [];
            
		    canvasCtx.save();  
		   
		    analyser.getByteTimeDomainData(dataArray);
		    canvasCtx.fillStyle = 'rgb(0,0,0)';
		    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
		    canvasCtx.lineWidth = 5;

		    canvasCtx.strokeStyle = "purple";
		    canvasCtx.beginPath();
		    var sliceWidth = canvas.width / bufferLength;
		    var x = 0;
		      
		    for(var i = 0; i < bufferLength; i++) {
              
		      var v = dataArray[i] / 128.0;
		      var y = v * canvas.height/2;

		      if(i === 0) {
		        canvasCtx.moveTo(x, y);
		      } else {
                canvasCtx.lineTo(x, y); 
                soundWave.push(new Point(x, y));
		      }
		      x += sliceWidth;
		    }
            
		    canvasCtx.lineTo(canvas.width, canvas.height/2);
            canvasCtx.lineTo(0, canvas.height/2);
            canvasCtx.stroke();
            canvasCtx.restore();
            drawSoundWaves();
            pushSoundWave();
		    
	  };
      
      function drawSoundWaves(){
           
          console.log("drawing sound + " + lastSoundWaves.length);
          canvasCtx.strokeStyle = getRandomColor();
          canvasCtx.lineWidth = 0.3;
          for(wave in lastSoundWaves){
              canvasCtx.save();  
              for(p in wave){
                 canvasCtx.lineTo(p.x, p.y);     
              }
              canvasCtx.lineTo(canvas.width, canvas.height/2);
              canvasCtx.lineTo(0, canvas.height/2);
              canvasCtx.stroke(); 
              canvasCtx.restore();  
          }
      }
        
        
    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
	  var update = function(){
	  	draw();
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

