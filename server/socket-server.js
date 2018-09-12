var server = require('http').createServer();
var io = require('socket.io')(server);
function SocketServer (){
}
var s = SocketServer;
var p = SocketServer.prototype;

p.start = function(port, onSuccess, onData){
	io.on('connection', function(client){
		// client.emit('init');
		onSuccess(client);
	  

	  client.on('disconnect', function(){
	  	console.log('CLIENT DISCONNECT', client.id);
	  });
	  
	});
	server.listen(port);
	console.log('Socket server started at port', port)
}

p.emit = function(event, data){
	io.sockets.emit(event, data);
}



module.exports = SocketServer;