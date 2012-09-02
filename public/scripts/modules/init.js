/*
 * NodeTV - scripts/modules/init.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

NTV.init = function() {
	
	var modes = {}
	  , result;
	
	// remote mode
	modes.remote = function() {
		
		return {
			success : true,
			mode : 'remote'
		};
	}
	
	// tv mode
	modes.tv = function() {
		
		setTimeout(function() {
		    if (!NTV.remote.connected) {
		        NTV.ui.notify('To enable remote control, open "' + document.title + ':' + location.port + '" on your smartphone.', null, true);
		    }
		}, 2000);
		
		return {
			success : true,
			mode : 'tv'
		};
	}
	
	// intiialize in mode based on client
	switch(NTV.client) {
		// remote control
		case 'remote':
			console.log('This client is running in REMOTE mode.');
			result = modes.remote();
			break;
		case 'tv':
			console.log('This client is running in TV mode.');
			result = modes.tv();
			break;
		default:
			console.error('NodeTV failed to determine the client type. Initialization failed.');
			result = {
				success : false,
				mode : null
			};
	}
	
	return result;
}
