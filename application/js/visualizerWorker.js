
	function messageHandler(event) {
	    this.postMessage(event.data);
	}

	// On définit la fonction à appeler lorsque la page principale nous sollicite
	// équivalent à this.onmessage = messageHandler;
	this.addEventListener('message', messageHandler, false);