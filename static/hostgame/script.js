var socket = io();
var counter = 0;
socket.on('addPlayer', function(data) {
	$("#playersList").append("<li>" + data + "</li>");
	counter += 1;
	if(counter == 5) {
		socket.emit('startgame', 0);
		$("#playersList").empty();
		$("#roomcode").empty();
	}
});

socket.on('gamestate', function(data) {
	$('#gardener').html("Your gardener is " + data.players[data.pres_id].name);
});
