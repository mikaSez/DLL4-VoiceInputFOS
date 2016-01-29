requirejs.config({
    baseUrl: 'js'
});

// Start the main app logic.
requirejs(['AR/audioRecorder', 'AR/audioRecorderWorker', 'domReady'],
function   (recorder, recorderWorker, domReady) {
    // Deal with prefixed APIs
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia;

    // Instantiating AudioContext
    try {
        var audioContext = new AudioContext();
    } catch (e) {
        console.log("Error initializing Web Audio");
    }
  

    var App = function(){
          var recorder; // voice recorder application
          var recognizer; // voice recognition application 
          var visualizer; //visualization application 
          var initialized = false; 
          var running = false; //are we currently recording ? 


          var config = {
            worker:recorderWorker
          };

          var init = function(stream){
             console.info("We need to initialize the application");
             var input = audioContext.createMediaStreamSource(stream);
             recorder = new AudioRecorder(input, config);
             visualizer = new Worker("js/visualizer.js");
             if (recognizer) recorder.consumers.push(recognizer);
             if (visualizer) recorder.consumers.push(visualizer);
             console.info("application initialized, starting.");
             recorder.start();
             initialized = true;
          }
          var start = function() {
             console.info("starting the application");
             running = true;
             if(!initialized){
                askForMicrophone();
             } else {
                recorder.start();   
             }
                 
          }
          var stop = function(){
             console.info("stoping the application");
            running = false;
            recorder.stop();
          }
          /**
          *Asks user to give us acces to his microphone
          */
          var askForMicrophone = function(callback){
             if (navigator.getUserMedia) {
                    navigator.getUserMedia({audio: true}, init,cannotStartUserMedia);
                    
                }
                else { 
                    console.log("No web audio support in this browser");
                    running = false;
                }
          }

         /**
         * Mainly : user refused us the acces to his microphone
         */
         var cannotStartUserMedia =  function(Error){
            console.log("No live audio input in this browser");
            running = false;
          }

          var switchRecordingState = function(){
            if(running){
                stop();
            } else {
                start();
            }
          }
          return {
            start:start,
            stop: stop,
            switchRecordingState
          };
    }

      
    var app = new App();
    domReady(function(){
        document.getElementById("audioSwitch").addEventListener("click", function(){app.switchRecordingState()});  

    });

});




