var socket = io();
socket.on('gamestate', function(data) {
	var president_id = data.pres_id;
	$('#gardener').is(data.players[pres_id].name);
});
