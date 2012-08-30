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
	
	// load styles
	blueprint.load(['/styles/applist.css']);
	
	// get app list data from server and initialize ui
	blueprint.request({
		type : 'GET',
		url : '/applist',
		expect : 'json',
		beforeSend : function(req) {
			NTV.ui.notify('Getting application list...', null, true);
		},
		success : displayAppList,
		failure : appLoaderFailed
	});
	
	// parse applist and display
	function displayAppList(applist) {
		// parse and overwrite localStorage
		apps = NTV.db.set('applist', applist);		
		// generate ui from localStorage data
		var apps = NTV.db.get('applist');
		
		// get template
		neckbeard.get('appListItem', function() {
			var tmpl = this;
			blueprint.each(apps, function() {
				var thisApp = this
				  , item = $(neckbeard.compile(tmpl, thisApp));
				// add it to the list
				list.append(item);
			});
			// give focus to the first app in the list
			NTV.ui.focusOn($('.ntv_app')[0]);
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
		apps : function() {
			return NTV.db.get('applist');
		},
		selected : selected
	};
	
})();
