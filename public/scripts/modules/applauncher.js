/*
 * NodeTV - scripts/modules/applauncher.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

NTV.launch = function(app_id) {
    
    // get app by id
    var app;
    
    // check app id against valid app list in memory
    blueprint.each(NTV.applist.apps(), function() {
        // if all is good
        if (this.id === app_id) {
            app = this;
            console.log(this.name);
             // show loader and notification
            NTV.ui.loader.show();
            NTV.ui.notify('Launching "' + this.name + '"...', null, true);
            // then launch it!
            ready();
            return false;
        }
    });
    
    function ready() {
        console.log('Launching ' + app.name + '...');
        // just hide stuff for now
        setTimeout(function() {
            NTV.ui.loader.hide();
            NTV.ui.notify('Failed to launch "' + app.name + '"', 'error', true);
        }, 2000);
    }
    
}
