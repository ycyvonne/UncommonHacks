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
	this.voteStatus = true;
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
	this.players = [];
	this.pres_idx = null;
	this.chanc_idx = null;
	this.inPower = false;
	this.deck = new Deck();
	this.score = {
		celery: 0,
		crow: 0
	}
	this.gameover = false;
	this.addPlayer = function(id, name){
		this.players.push(new Player(id, name));
	}
	this.assignRoles = function(){
		var roles = ["cel", "cel", "cel", "crow", "master"];
		shuffle(roles);
		for(var i=0; i<this.players.length; i++){
			this.players[i].role = roles[i];
		}
	}
	this.startGame = function() {
		if(players.length != 5) {
			//Error?
		}
		this.deck.shuffle();
		this.assignRoles();
		this.pres_idx = Math.floor(math.random()*5);
	}
	this.chooseChanc = function(idx) {
		this.chanc_idx = idx;
	}
	this.tallyVotes = function() {
		var yes = 0;
		for(var i=0; i<players.length; i++){
			if(players[i].voteStatus){
				yes += 1;
			}
		}
		if(yes>2){
			this.inPower = true;
			return true;
		}
		return false;
	}
	this.draw = function() {
		this.deck.draw3();
		return this.deck.limboPile;
	}
	this.discard = function(discardCard) {
		this.discardPile.push(discardCard);
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
			}
		}
	}
}

game = new Game()

io.on('connection', function(socket) {
	socket.on('join', function(data) {
		var userid = UUID();
		game.addPlayer(userid, data[1]['value']);
		//socket.emit('addPlayer', 
	});
});

