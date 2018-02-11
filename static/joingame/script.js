var socket = io();

function joinGame(){
	var formData = $('form').serializeArray();
	console.log("formdata", formData);
	socket.emit('join', formData);
}
