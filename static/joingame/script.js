function joinGame(){
	var formData = $('form').serializeArray();
	socket.emit('join', formData);
}
