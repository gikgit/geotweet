var express = require('express');
var exphbs = require('express-handlebars');
var http = require('http');
var Twit = require('./controller/twitter');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use("/", express.static(__dirname + "/public/"));

// router
app.use('/', routes);

// create s server
var port = process.env.PORT || 3000 ;
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});

// create a socket
var io = require('socket.io').listen(server);
io.on('connection', function(socket) {
  console.log('socket.io connected');
  socket.on('stop', function(){
    console.log('stop!');
    Twit.stop();
  });

  socket.on('restart', function(){
    console.log('restart!');
    Twit.restart();
  });

  socket.on('clear', function(){
    console.log('clear data!');
    Twit.clear(function(emptyCollection) {
      console.log(emptyCollection);
      io.emit('callback', {data:emptyCollection});
    });
  });

  Twit.on(function(collection){
      io.emit('callback', {data:collection});
  });   
  // socket.on('data', function(data) {
  //   var minlong = Number(data.minlong);
  //   var minlat = Number(data.minlat);
  //   var maxlong = Number(data.maxlong);
  //   var maxlat = Number(data.maxlat);
  //   Twit.fetch([minlong, minlat, maxlong, maxlat], function(return_data){
  //     io.emit('callback', {data:return_data});
  //   });
  // });
});
