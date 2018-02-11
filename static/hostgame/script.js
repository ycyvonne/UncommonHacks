var socket = io();
var counter = 0;

var canAddPeople = true;
var currentSlide = 1;
var btnInterval;

socket.on('addPlayer', function(data) {
	if (canAddPeople) {
		$("<li>" + data[0] + "</li>").hide().appendTo('#playersList').fadeIn(300);
		counter += 1;
		if(counter == 5) {
			canAddPeople = false;
			btnInterval = setInterval(function() {
				$('.next-btn').toggleClass('rotate');
			}, 500);
		}
	}
});

socket.on('gamestate', function(data) {
	$('#gardener').html(data.players[data.pres_id].name);
	//TODO: display scores
	console.log(data.score);
	if (!data.inpower) {
		if (data.chanc_id == null) {
			//TODO: diplay message
			console.log("Gardener is picking the scarecrow...");
		} else {
			// //TODO: display message
			// console.log("It's voting time!");
			$('.slide-2').addClass('hide');
			$('.slide-3').removeClass('hide');
		}
	} else {
		//TODO: display msg
		console.log("Cards are being drawn...");
	}
});

socket.on('gameover', function(data) {
	//TODO: display winner and credits
	console.log(data);
});

$('document').ready(function() {
	setTimeout(function() {
		$('.center-large').removeClass('initial');
		console.log('hi')
	}, 100);

	$('.next-btn').click(function() {

		if (!canAddPeople && currentSlide == 1) {
			clearInterval(btnInterval)
			socket.emit('startgame', 0);

			$('.slide-1').addClass('hide');
			$('.slide-2').removeClass('hide');

			$("#playersList").empty();
			$("#roomcode").empty();
			$('.next-btn').removeClass('rotate');
			currentSlide += 1;
		}
	})
});
