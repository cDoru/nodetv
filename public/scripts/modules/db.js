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
		db.setItem(item, store);
		// give it back
		return data;
	}
	
	function remove(item) {
		db.removeItem(itemPrefix + item);
	}
	
	return {
		get : get,
		set : set,
		clear : db.clear,
		remove : remove
	};
	
})();
