var express     = require('express');
var app         = require('express')();
var server      = require('http').createServer(app);
var io          = require('socket.io').listen(server);
var ejs         = require('ejs');
var bodyParser = require('body-parser');

function Message(message, sender){
    this.message = message;
    this.sender = sender;
}

var messageLog = [];

app.set('view engine', 'ejs');

app.use(bodyParser());


app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
    res.render('index', {messages: messageLog});
});

io.on('connection', function(socket) {
    console.log('Client connected +1');
    socket.on('newMessage', function(message){
        if (socket.pseudo == 0) {
            socket.pseudo = 'anonimous';
        }
        socket.broadcast.emit('newMessage', {sender: socket.pseudo, message: message})
    });
    socket.on('pseudo', function(pseudo){
        socket.pseudo = pseudo;
        socket.broadcast.emit('newUser', pseudo + ' joined !');
    })
});

server.listen(process.env.PORT || 3000, function(){
    console.log('app running');
});
