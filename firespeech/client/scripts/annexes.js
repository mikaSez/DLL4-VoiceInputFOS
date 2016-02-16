// Copier dans le presse papier
var copyBtn = document.getElementById('copy');

copyBtn.addEventListener('click', function(event) {
	var textarea = document.getElementById('resultat');
	textarea.select();

	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		console.log('Copying text command was ' + msg);
	} catch (err) {
		console.log('Oops, unable to copy');
	}
});