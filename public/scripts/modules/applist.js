/*
 * NodeTV - scripts/modules/applist.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

NTV.applist = (function() {
	
	var apps
	  , list = $('#ntv_applist')
	  , selected = null;
	
	// get app list data from server and initialize ui
	blueprint.request({
		type : 'GET',
		url : '/applist',
		beforeSend : function(req) {
			NTV.ui.notify('Getting application list...', null, true);
		},
		success : displayAppList,
		failure : appLoaderFailed
	});
	
	// parse applist and display
	function displayAppList(applist) {
		// parse and overwrite localStorage
		NTV.db.set('applist', applist);		
		// generate ui from localStorage data
		var apps = NTV.db.get('applist');
		blueprint.each(apps, function() {
			var thisApp = this;
			// get template
			neckbeard.get('appListItem', function(tmpl) {
				// parse compiled output as nodes
				var item = $(neckbeard.compile(tmpl, thisApp));
				// add it to the list
				list.append(item);
			});
		});
		
		// let the user know it's all good
		NTV.ui.loader.hide();
		NTV.ui.notify('Applications loaded!');
	}
	
	// let the user know that something went wrong
	function appLoaderFailed() {
		NTV.ui.loader.hide();
		NTV.ui.notify('Failed to load apps, restart NodeTV and try again.', 'error', true);
	}
	
	return {
		element : list,
		apps : apps,
		selected : selected
	};
	
})();
