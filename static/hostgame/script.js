var socket = io();
var counter = 0;

var canAddPeople = true;
var currentSlide = 1;
var btnInterval;

socket.on('addPlayer', function(data) {
	if (canAddPeople) {
		$("<li>" + data + "</li>").hide().appendTo('#playersList').fadeIn(300);
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