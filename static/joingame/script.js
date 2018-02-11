var socket = io();
var currentSlide = 1;

function joinGame(){
	var formData = $('form').serializeArray();
	console.log("formdata", formData);
	sessionStorage.clear();
	socket.emit('join', formData);
}

nominateChanc = function(id) {
	socket.emit('newchanc', id);
}

voteChanc = function(vote) {
	socket.emit('votechanc', [vote, sessionStorage.getItem("userid")]);
}

discardCard = function(card) {
	socket.emit('discard', card);
}

socket.on('addPlayer', function(data) {

	$('.slide-1').addClass('left-hide');
	$('.slide-2').removeClass('right-hide');
	currentSlide = 2;

	if(!sessionStorage.getItem("userid")){
		sessionStorage.setItem("userid", data[1]);
		console.log(sessionStorage.getItem("userid"));
	}

});

var nominatedScarecrow = false;

socket.on('gamestate', function(data) {

	$('.slide-2').addClass('left-hide');
	$('.slide-3').removeClass('right-hide');

	currentSlide = 3;

	var role = data.players[sessionStorage.getItem("userid")].role;
	var playerName = data.players[sessionStorage.getItem("userid")].name;

	console.log('roles', role)
	if (role == 'master') {
		$('#master').removeClass('hide');
	}
	if (role == 'cel') {
		role = 'celery'
	}
	else {
		role = 'crow'
	}
	$('.player-card').addClass(role);
	$("#role").html(role);
	$('#player-name').html(playerName)

	if(!data.inPower) {
		if (data.chanc == null) {
			// chancelor not nominated yet
			if (sessionStorage.getItem("userid") == data.pres_id) {
				
				if (!nominatedScarecrow) {
					// president choosing chancelor
					//TODO: insert buttons into div choosechanc and an onclick handler(nominateChanc)
					console.log("Scarecrow candidates:");
					$('.choose-scarecrow .card-inner').html();
					$('.choose-scarecrow').removeClass('hide');

					for (var id in data.players) {
						if (id != data.pres_id) {
							console.log('adding...', data.players[id].name)
							$('.choose-scarecrow .card-inner').append('<div class="scarecrow-choice card-label" data-id="' + id + ' ">' + data.players[id].name + '</div>')
						}
					}

					$('.scarecrow-choice').click(function(e) {
						$('.scarecrow-choice').addClass('disable-touch');
						$(e.target).addClass('selected');
						nominateChanc($(e.target).attr('data-id'));
						nominatedScarecrow = true;
					});
				}


			} else {
				// others waiting for the president to pick the chancelor
				//TODO: display text below
				console.log("The gardener is picking a scarecrow ...");
			}
		} else {

			console.log("time to vote!!!", data)

			// votes
			if (data.players[sessionStorage.getItem("userid")].voteStatus == null) {
				// vote
				//TODO: create 2 buttons (yay/nay) and onclick handlers
				$('.slide-3').addClass('left-hide');
				$('.slide-4').removeClass('right-hide');
				

				$('.vote-btn').click(function(e){
					$(e.target).addClass('selected');
					$('.vote-btn').addClass('disable-touch');
					console.log('voted ', $(e.target).attr('data-id') == 'yes')
					voteChanc($(e.target).attr('data-id') == 'yes');
				});

			} else {
				// waiting for others
				//TODO: display text below
				console.log("Waitng for others to vote ...");
			}
		}
	} else {
		// government in power
		if (sessionStorage.getItem("userid") == data.pres_id) {
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
		} else if (sessionStorage.getItem("userid") == data.pres_id) {
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
