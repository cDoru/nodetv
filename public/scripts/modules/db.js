/*
 * NodeTV - scripts/modules/db.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

NTV.db = (function() {
	
	var db = localStorage
	  , itemPrefix = 'ntv_'
	  , indexRun = false;
	  
	
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
	if (!get('library')) {
	    // library has not been generated
	    // so initiliaze prompt
	    NTV.ui.loader.show();
	    // get the mounted disks
	    blueprint.request({
	    	type : 'GET',
	    	url : '/getMountedDisks',
	    	expect: 'json',
	    	success : NTV.diskselect.init,
	    	failure : function() {
	    		NTV.ui.loader.hide();
	    		NTV.ui.notify('Failed to detect mounted disks.', 'error', true);
	    	}
	    });
	}
	
	// sends a post request to the server based on type [lan, local, mount],
	// the path to the media directory, and ondata function that can be used
	// for messaging to the user the status of the index and a callback 
	// function - the callback gets executed after library is indexed and stored
	function indexLibrary(path, onData, callback) {
	    if (!indexRun) {
    	    // listen for progress if not already listening
            NTV.socket.on('libscan', onData);
       }
        // return library
        blueprint.request({
            type : 'POST',
            url : '/indexLibrary?' + blueprint.querystring.make({ path : path }),
            success : function(data) {
                var library = set('library', JSON.parse(data));
                callback.call(this, library);
                indexRun = true;
            },
            failure : function(data) {
                NTV.ui.notify(data, 'error', true);
            }
        });
	}
	
	return {
		get : get,
		set : set,
		clear : db.clear,
		remove : remove,
		index : indexLibrary
	};
	
})();
