/*
 * NodeTV - scripts/modules/remote-client.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

NTV.remote = (function() {
	
	// get remote DOM elements
	var remote = $('#remote')
	  , buttons = {
			left : $('.left', remote),
			right : $('.right', remote),
			up : $('.up', remote),
			down : $('.down', remote),
			menu : $('.menu', remote),
			back : $('.back', remote),
			select : $('.select', remote),
			play : $('.play', remote),
			stop : $('.stop', remote),
			trackLeft : $('.trackLeft', remote),
			trackRight : $('.trackRight', remote)
		}
	  , actions = null;
		
	// we need to create an action set that can be switched
	// on the fly, so first an action set constructor and
	// then a method for switching the current active action set
	var ActionSet = function(action_obj) {	
		// pull in all the valid properties
		this.actions = action_obj;
	}
	// allow switching out actions indirectly
	ActionSet.prototype.enable = function() {
		actions = this.actions;
	}
	
	// create the default action set
	NTV.actions.applist = new ActionSet({
		right : function(e) {
			
		},
		up : function(e) {
			
		},
		down : function(e) {
			
		},
		select : function(e) {
			alert('select');
		}
	});
	// enable the default action set for app list
	NTV.actions.applist.enable();
	
	// bind the remote buttons to the mapped actions
	if (NTV.client == 'remote') {
		blueprint.each(buttons, function(button, elm) {
			elm.bind('click', function(event) {
				// send socket.io event
				NTV.socket.broadcast('buttonPress', { 
					pressed : button
				});
			});
		});
	}
	
	// listen for socket.io event to execute callback
	// if in tv mode, also map to keyboard function 
	// in case user does not have a remote
	if (NTV.client == 'tv') {
		NTV.socket.on('buttonPress', function(button) {
			console.log('Remote input detected: ' + button.pressed);
			if (actions[button.pressed]) {
				actions[button.pressed].call(this);
			}
		});
	
		// map button events to keyboard
		tappa.state({
			'left' : function() {
				$('.left', remote).trigger('touchstart');
			},
			'right' :function() {
				$('.right', remote).trigger('touchstart');
			},
			'up' : function() {
				$('.up', remote).trigger('touchstart');
			},
			'down' : function() {
				$('.down', remote).trigger('touchstart');
			},
			'm' : function() {
				$('.menu', remote).trigger('touchstart');
			},
			'b' : function() {
				$('.back', remote).trigger('touchstart');
			},
			'enter' : function() {
				$('.select', remote).trigger('touchstart');
			},
			'space' : function() {
				$('.play', remote).trigger('touchstart');
			},
			'x' : function() {
				$('.stop', remote).trigger('touchstart');
			},
			'comma' : function() {
				$('.trackLeft', remote).trigger('touchstart');
			},
			'period' : function() {
				$('.trackRight', remote).trigger('touchstart');
			},
		});
	}
	
	return {
		ActionSet : ActionSet
	};
	
})();
