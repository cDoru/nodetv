/*
 * NodeTV - scripts/modules/diskselect.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

NTV.diskselect = (function() {
	
	
	// get fired when disk data is returned from server
	function init(disks) {
		// disks is an array of literals containing:
		// name
		// path
		console.log('Successfully detected ' + disks.length + ' mounted disks.');
		blueprint.each(disks, function() {
			console.log('- ' + this.name);
		});
	}
	
	function listDirectories(path, callback) {
		// create query
		var path = '?' + { path : path };
		// send request for directories
		blueprint.request({
			type : 'GET',
			url : '/listDirectories' + path,
			expect : 'json',
			success : callback,
			failure : function(err) {
				NTV.ui.notify(err, 'error', true);
			}
		});
	}
	
	return {
		init : init
	};
	
})();