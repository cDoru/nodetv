/*
 * NodeTV - scripts/loader.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

var NTV = (function() {
	
	// define modules
	var modules = [
		'/scripts/modules/init.js',
		'/scripts/modules/db.js',
		'/scripts/modules/remote-client.js',
		'/scripts/modules/ui.js',
		'/scripts/modules/applist.js',
		'/scripts/modules/applauncher.js',
		'/scripts/modules/app-api.js'
		]
	  , netIp = document.title
	// open socket connection
	  , socket = io.connect(netIp)
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
	switch(client.type) {
		case 'tv':
			console.log('TV Connected');
			socket.emit('tvConnected', client);
			break;
		case 'remote':
			console.log('Remote Connected');
			socket.emit('remoteConnected', client);
			break;
		default:
			// device not supported
	}
	
	// load modules
	blueprint.load(modules, function() {
		NTV.init();
	});
	
	// return empty obj to extend
	return {
		client : client.type,
		actions : {},
		netIp : netIp,
		socket : socket
	};
	
})();
