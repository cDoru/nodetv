/*
 * NodeTV - scripts/modules/diskselect.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

NTV.diskselect = (function() {
	
	var ui = $('#ntv_diskselect')
	  , disklist = $('#detectedDrives')
	  , disks;
	
	// size the ui
	ui.hide();
	ui.width(screen.width - 501);
	ui.height(screen.height);
	
	// get fired when disk data is returned from server
	function init(disks) {
		// disks is an array of literals containing:
		// name
		// path
		ui.fadeIn(200);
		console.log('Successfully detected ' + disks.length + ' mounted disks.');
		// get template
		neckbeard.get('disklist', function() {
		    var tmpl = this;
		    // for each disk returned
		    blueprint.each(disks, function() {
		        // compile a template
                var item = neckbeard.compile(tmpl, this);
                console.log('- ' + this.name);
                disklist.append(item);
            });
            disks = $('.disk', disklist[0]);
            // focus on disk list
            NTV.ui.focusOn(disks[0]);
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