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
		up : function(e) {
			NTV.remote.navList.go('up');
		},
		down : function(e) {
			NTV.remote.navList.go('down');
		},
		select : function(e) {
			NTV.remote.navList.go('select');
		}
	});
	// enable the default action set for app list
	NTV.actions.applist.enable();
	
	// bind the remote buttons to the mapped actions
	if (NTV.client === 'remote') {		
		blueprint.each(buttons, function(button, elm) {
			elm.bind('touchstart', function(event) {
				// send socket.io event
				NTV.socket.emit('buttonPress', { 
					pressed : button
				});
			});
		});
	}
	
	// listen for socket.io event to execute callback
	// if in tv mode, also map to keyboard function 
	// in case user does not have a remote
	if (NTV.client === 'tv') {
		// tell server what type of device connected
		NTV.socket.on('remoteConnected', function(data) {
			NTV.ui.notify('Remote Connected!');
		});
		
		NTV.socket.on('buttonPress', function(button) {
			console.log('Remote input detected: ' + button.pressed);
			// play click sound
			NTV.ui.sounds.play('click');
			if (actions[button.pressed]) {
				actions[button.pressed].call(this);
			}
		});
	
		// map button events to keyboard
		tappa.state({
			'left' : function() {
				// left
				NTV.ui.sounds.play('click');
			},
			'right' :function() {
				// right
				NTV.ui.sounds.play('click');
			},
			'up' : function() {
				// up
				NTV.ui.sounds.play('click');
			},
			'down' : function() {
				// down
				NTV.ui.sounds.play('click');
			},
			'm' : function() {
				// menu
				NTV.ui.sounds.play('click');
			},
			'b' : function() {
				// back
				NTV.ui.sounds.play('click');
			},
			'enter' : function() {
				// select
				NTV.ui.sounds.play('click');
			},
			'space' : function() {
				// play
				NTV.ui.sounds.play('click');
			},
			'x' : function() {
				// stop
				NTV.ui.sounds.play('click');
			},
			'comma' : function() {
				// trackLeft
				NTV.ui.sounds.play('click');
			},
			'period' : function() {
				// trackRight
				NTV.ui.sounds.play('click');
			},
		});
	}
	
	// app list navigation logic
	var navList = (function() {
	    
	    function go(direction) {
	        var list = $('.ntv_app')
	          , current = $('.ntv_app.has_focus')[0]
	          , id = $(current).attr('data-appid');
	        
	        switch(direction) {
	            case 'up':
	               // move up
	               if (!(current === list[0])) {
	                   NTV.ui.focusOn($(current).prev());
	               }
	               break;
	            case 'down':
	               // move down
                   if (!(current === (list[list.length - 1]))) {
                       NTV.ui.focusOn($(current).next());
                   }
	               break;
	            case 'select':
	               NTV.launch(id);	               
	               break;
	            default:
	               // do nothing
	        }
	        
	        return {
	            go : go
	        };
	    }
	    
	    return {
	        go : go
	    };
	    
	})();
	
	return {
		ActionSet : ActionSet,
		navList : navList
	};
	
})();
