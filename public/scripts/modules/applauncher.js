/*
 * NodeTV - scripts/modules/applauncher.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

NTV.launch = function(app_id) {
    
    // get app by id
    var app
      , appCtr = $('#appCtr')
      , viewSize = {
          width: window.screen.width - NTV.applist.element.parent().width(),
          height: window.screen.height
        }
      , appdir = app_id.split(':')[0];
      
    // adjust the app container size
    appCtr.width(viewSize.width);
    appCtr.height(viewSize.height);
    
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
                
        // send launch signal to server
        blueprint.request({
            type : 'POST',
            url : '/launch/' + appdir,
            success : launchInit,
            failure : launchErr
        });  
            
        // execute scripts, and load app view
        function launchInit(view) {
            // render view
            appCtr.html(view);
            if (!NTV.applist.launched[app_id]) {
                blueprint.load(app.scripts, function() {
                    NTV.appregistry[appdir].onlaunch.call(this, app);
                    NTV.applist.launched[app_id] = true;
                });
            } else {
                NTV.appregistry[appdir].onlaunch.call(this, app);
            }
            appCtr.fadeIn(200);
            NTV.ui.loader.hide();
        }
        
        // show error
        function launchErr() {
            NTV.ui.loader.hide();
            NTV.ui.notify('Failed to launch "' + app.name + '"', 'error', true);
        }
    }
    
}
