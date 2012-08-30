/*
 * NodeTV - scripts/modules/ui.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

NTV.ui = (function() {
	
	var tv = $('#tv')
	  , remote = $('#remote');
	
	// create a simple notification alert
	function notify(text, type) {
		
		var notification = $('#notification')
		  , cssClass = (type === 'error') ? 'ntv_error' : '';
		
		notification.attr('class','');
		notification.addClass(cssClass);
		notification.html(text);
		
		notification.fadeIn(200, function() {
			notification.delay(1200).fadeOut(200);
		});
	}
	
	
	return {
		notify : notify
	};
	
})();