var socket = io();

function joinGame(){
	var formData = $('form').serializeArray();
	console.log("formdata", formData);
	socket.emit('join', formData);
}

socket.on('addPlayer', function(data) {
	$('#joinform').empty();
	$('#joinbutton').empty();
	$('#waiting').html("Waiting for other players to join ...");
});

socket.on('gamestate', function(data) {
	
});
