/*
 * NodeTV - remote.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

module.exports = function(io) {
	
	var remoteConnected = function(socket) {
		
		// catch button press and pass back to client
		socket.on('buttonPress', function(button) {
			console.log('Passing remote input: ' + button.pressed);
			socket.emit('buttonAction', button);
		});
		
	};
	
	// set connection and get device information
	// if remote is connected then start listening
	// for events
	io.sockets.on('connection', function(socket) {
		// tell the client the handshake was good
		socket.emit('connected', {
			connected: true
		});
		// when the client sends type, determine whether
		// to start remote listener or not
		socket.on('client_type', function(client) {
			console.log('Client connected in ' + client.type + ' mode.');
			if (client.type === 'remote') {
				remoteConnected.call(this, socket);
			}
		});
	});


}