/*
 * NodeTV - remote.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

module.exports = function(io) {
	
	var remoteConnected = function(socket) {
		
		
		
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
			console.log(client);
			if (client.type === 'remote') {
				remoteConnected.call(this, socket);
			}
		});
	});


}