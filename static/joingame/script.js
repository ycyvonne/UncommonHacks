var socket = io();

function joinGame(){
	var formData = $('form').serializeArray();
	console.log("formdata", formData);
	socket.emit('join', formData);
}

nominateChanc = function(id) {
	socket.emit('newchanc', id);
}

voteChanc = function(vote) {
	socket.emit('votechanc', vote);
}

discardCard = function(card) {
	socket.emit('discard', card);
}

socket.on('addPlayer', function(data) {
	$('#joinform').empty();
	$('#joinbutton').empty();
	$('#waiting').html("Waiting for other players to join ...");
});

socket.on('gamestate', function(data) {
	if(!data.inPower) {
		if (!data.chanc) {
			// chancelor not nominated yet
			if (sessionStorage.userid == data.pres_id) {
				// president choosing chancelor
				//TODO: insert buttons into div choosechanc and an onclick handler(nominateChanc)
				console.log("Scarecrow candidates:");
				for (var id in data.players) {
					if (id != data.pres_id) {
						console.log(data.players[id].name);
					}
				}
			} else {
				// others waiting for the president to pick the chancelor
				//TODO: display text below
				console.log("The gardener is picking a scarecrow ...");
			}
		} else {
			// votes
			if (data.players[sessionStorage.userid].voteStatus == null) {
				// vote
				//TODO: create 2 buttons (yay/nay) and onclick handlers
				console.log("time to vote");
			} else {
				// waiting for others
				//TODO: display text below
				console.log("Waitng for others to vote ...");
			}
		}
	} else {
		// government in power
		if (sessionStorage.userid == data.pres_id) {
			// president
			if (data.deck.limboPile.length == 3) {
				// discard 1 out of 3
				//TODO: display 3 buttons and onclick handler (discardCard)
				console.log(data.deck.limboPile);
			} else {
				// wait for the chancelor to pick a card
				//TODO: display waiting message
				console.log("Waiting for the chancelor to pick a card...");
			}
		} else if (sessionStorage.userid == data.pres_id) {
				// chancelor
			if (data.deck.limboPile.length == 2) {
				// chancelor picks a card
				//TODO: display 2 buttons and onclick handler (discardCard)
				console.log(data.deck.limboPile);
			} else {
				// wait for the president to discard one
				//TODO: display waiting message
				console.log("Waiting for the president to discard a card...");
			}
		} else {
			// civilians waiting
			//TODO: display waiting message
			console.log("Waiting...");
		}
	}	
});

socket.on('gameover', function(data) {
	//TODO: display the winner
	console.log("winner", data);
});
