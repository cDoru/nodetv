/*
 * NodeTV - scripts/modules/ui.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

NTV.ui = (function() {
	
	var tv = $('#tv')
	  , remote = $('#remote')
	  , loader = {}
	  , hasFocus = null;
	
	// create a simple notification alert
	function notify(text, type, persist) {
		
		var notification = $('#ntv_notification')
		  , cssClass = (type === 'error') ? 'ntv_error' : '';
		
		notification.attr('class','');
		notification.addClass(cssClass);
		notification.html(text);
		
		notification.fadeIn(200, function() {
			if (!persist) {
				notification.delay(2000).fadeOut(200);
			}
		});
	}
	
	// loading indicator
	loader.element = $('#loader');
	loader.show = function() {
		if (loader.element.is(':hidden')) {
			loader.element.fadeIn(100);
		}	
	}
	loader.hide = function() {
		if (loader.element.is(':visible')) {
			loader.element.fadeOut(100);
		}
	}
	
	// switch focus to element
	function focusOn(element) {
		var focusElm = $(element)
		  , className = 'has_focus'
		  , current = $('.' + className);
		
		current.removeClass(className);
		focusElm.addClass(className);
		NTV.ui.hasFocus = focusElm;
	}
	
	return {
		notify : notify,
		loader : loader,
		focusOn : focusOn,
		hasFocus : hasFocus
	};
	
})();