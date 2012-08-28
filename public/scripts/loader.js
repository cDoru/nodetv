/*
 * NodeTV - scripts/loader.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

var NTV = (function() {
	
	// define modules
	var modules = [
		'/scripts/modules/ntv-client.js',
		'/scripts/modules/remote-client.js'
		]
	// open socket connection
	  , socket = io.connect('http://localhost')
	// determine client type
	  , isMobile = {
		    Android: function() {
		        return navigator.userAgent.match(/Android/i) ? true : false;
		    },
		    BlackBerry: function() {
		        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
		    },
		    iOS: function() {
		        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
		    },
		    Windows: function() {
		        return navigator.userAgent.match(/IEMobile/i) ? true : false;
		    },
		    any: function() {
		        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
		    }
		}
	// override client mode with querystring for debugging
	  , clientOverride = blueprint.querystring.get('client')
	// assume all mobile devices should run in remote mode unless override exists
	  , client = {
			type : (isMobile.any()) ? clientOverride || 'remote' : clientOverride || 'tv'
		};
	
	// tell server what type of device connected
	socket.on('connected', function(data) {
		console.log(data);
		socket.emit('client_type', client);
	});
	
	// load modules
	blueprint.load(modules, function() {
		NTV.init();
	});
	
	// return empty obj to extend
	return {
		client : client.type,
		actions : {}
	};
	
})();
