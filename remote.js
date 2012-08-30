/*
 * NodeTV - remote.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

module.exports = function(io) {
	
	// set connection and get device information
	// if remote is connected then start listening
	// for events
	io.sockets.on('connection', function(socket) {
	
		// tell the client the handshake was good
		socket.broadcast.emit('connected', {
			connected: true
		});

		// when the client sends type, determine whether
		socket.on('tvConnected', function(client) {
			console.log('TV Connected!');
			socket.broadcast.emit('tvConnected', client);
		});
		
		socket.on('remoteConnected', function(client) {
			console.log('Remote control connected!');
			socket.broadcast.emit('remoteConnected', client);
		});
		
		// catch button press and pass back to client
		socket.on('buttonPress', function(button) {
			console.log('Passing remote input: ' + button.pressed);
			socket.broadcast.emit('buttonPress', button);
		});	
	
	});


}