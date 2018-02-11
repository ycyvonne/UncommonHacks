var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var UUID = require('node-uuid');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
	console.log('Starting server on port 5000');
});

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function Player(id, name){
	this.id = id;
	this.role = "";
	this.name = name;
	this.voteStatus = null;
	this.vote = function(v){
		this.voteStatus = v;
	}
}

function Deck(){
	this.drawPile = [
		"celery",
		"celery",
		"celery",
		"celery",
		"celery",
		"celery",
		"crow",
		"crow",
		"crow",
		"crow",
		"crow",
		"crow",
		"crow",
		"crow",
		"crow",
		"crow",
		"crow"
		];
	this.limboPile = [];
	this.discardPile = [];
	this.shuffle = function(){
		this.drawPile = this.drawPile.concat(this.discardPile);
		this.discardPile = [];
		shuffle(this.drawPile);
	}
	this.draw3 = function(){
		if(this.drawPile.length < 3) {
			this.shuffle();
		}
		for(var i=0; i<3; i++){
			this.limboPile.push(this.drawPile.shift());
		}
	}
}

function Game(){
	this.players = {};
	this.pres_id = null;
	this.chanc_id = null;
	this.inPower = false;
	this.deck = new Deck();
	this.score = {
		celery: 0,
		crow: 0
	}
	this.voted = 0;
	this.gameover = false;
	this.addPlayer = function(id, name){
		this.players[id] = new Player(id, name);
	}
	this.assignRoles = function(){
		var roles = ["cel", "cel", "cel", "crow", "master"];
		shuffle(roles);
		var i = 0;
		for(var id in this.players){
			this.players[id].role = roles[i];
			i += 1;
		}
	}
	this.startGame = function() {
		if(Object.keys(this.players).length != 5) {
			//Error?
		}
		this.deck.shuffle();
		this.assignRoles();
		var ids = Object.keys(this.players);
		shuffle(ids);
		this.pres_id = ids[0];
	}
	this.chooseChanc = function(id) {
		this.chanc_id = id;
	}
	this.tallyVotes = function() {
		var yes = 0;
		for(var id in this.players){
			if(this.players[id].voteStatus){
				yes += 1;
			}
		}
		if(yes>2){
			this.inPower = true;
			console.log('yes, this is', this)
			return true;
		}
		return false;
	}
	this.changePres = function() {
		var found = false;
		for (var id in this.players) {
			if (found) {
				this.pres_id = id;
				found = false;
				break;
			}
			if (id == this.pres_id) {
				found = true;
			}
		}
		if (found) {
			for (var id in this.players) {
				this.pres_id = id;
				break;
			}
		}
	}
	this.draw = function() {
		this.deck.draw3();
	}
	this.discard = function(discardCard) {
		console.log('discardCard', discardCard)
		this.deck.discardPile.push(discardCard);
		for(var i=0;i<this.deck.limboPile.length;i++){
			if(this.deck.limboPile[i]==discardCard){
				this.deck.limboPile.splice(i, 1);
			}
		}
		if(this.deck.limboPile.length == 1) {
			this.score[this.deck.limboPile[0]] += 1;
			if(this.score[celery] == 5) {
				this.winner = "celery";
				this.gameover = true;
			}
			else if(this.score[crow] == 6) {
				this.winner = "crow";
				this.gameover = true;
			}
			else {
				this.deck.limboPile = [];
				this.chanc = null;
			}
		}
	}
}

game = new Game()

io.on('connection', function(socket) {
	socket.on('join', function(data) {
		var userid = UUID();
		game.addPlayer(userid, data[1]['value']);
		io.sockets.emit('addPlayer', [data[1]['value'], userid]);
	});
	socket.on('startgame', function(data) {
		game.startGame();
		io.sockets.emit('gamestate', game);	
	});
	socket.on('newchanc', function(data) {
		game.chooseChanc(data);
		io.sockets.emit('gamestate', game);
	});
	socket.on('votechanc', function(data) {
		game.players[data[1]].vote(data[0]);
		game.voted += 1;
		if (game.voted == 5) {
			if (!game.tallyVotes()) {
				game.changePres();
				game.chanc_id = null;				
			} else {
				game.draw();
			}
			game.voted = 0;
			for (var id in game.players) {
				game.players[id].voteStatus = null;
			}
		}
		io.sockets.emit('gamestate', game);
	});
	socket.on('discard', function(data) {
		game.discard(data);
		if (game.gameover) {
			io.sockets.emit('gameover', game.winner);
		} else {
			io.sockets.emit('gamestate', game);
		}
	});
	socket.on('broadcastgame', function(data) {
		io.sockets.emit('gamestate', game);
	});
});

