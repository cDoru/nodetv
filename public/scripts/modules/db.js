/*
 * NodeTV - scripts/modules/db.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

NTV.db = (function() {
	
	var db = localStorage
	  , itemPrefix = 'ntv_';
	  
	
	function get(item) {
		// retrieve data by its prefixed name
		var data = db.getItem(itemPrefix + item);
		// if it comes back, parse and return it
		if (data) {
			return JSON.parse(data);
		} else {
			// otherwise return null
			return null;
		}
	}
	
	function set(item, data) {
		// convert to JSON string
		var store = JSON.stringify(data);
		// store it
		db.setItem(itemPrefix + item, store);
		// give it back
		return data;
	}
	
	function remove(item) {
		db.removeItem(itemPrefix + item);
	}
	
	// check if NodeTV has indexed a library yet
	if (!NTV.db.get('library')) {
	    // library has not been generated
	    // so initiliaze prompt
	}
	
	// sends a post request to the server based on type [lan, local, mount],
	// the path to the media directory, and ondata function that can be used
	// for messaging to the user the status of the index and a callback 
	// function - the callback gets executed after library is indexed and stored
	function indexLibrary(path, onData, callback) {
        // return library
        blueprint.request({
            type : 'POST',
            url : '/indexlibrary',
            data : {
                path : path
            },
            success : function(data) {
                var library = NTV.db.set('library', JSON.parse(data));
                callback.call(this, library);
            },
            failure : function(data) {
                NTV.ui.notify(data, 'error', true);
            }
        });
        // listen for progress
        NTV.socket.on('libIndex', onData);
	}
	
	return {
		get : get,
		set : set,
		clear : db.clear,
		remove : remove,
		index : indexLibrary
	};
	
})();
