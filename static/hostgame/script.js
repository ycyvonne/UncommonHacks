var socket = io();
var counter = 0;
socket.on('addPlayer', function(data) {
	$("#playersList").append("<li>" + data + "</li>");
	counter += 1;
	if(counter == 5) {
		window.location.href = "game.html";
		socket.emit('startgame', 0);
	}
});


