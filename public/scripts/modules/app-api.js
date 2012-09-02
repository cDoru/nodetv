/*
 * NodeTV - scripts/modules/app-api.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

NTV.appregistry = {};

NTV.app = function(app_dirname, onlaunch) {
    // set onlaunch handler
    this.onlaunch = onlaunch;
    this.id = app_dirname
    // register app
    NTV.appregistry[this.id] = {};
    NTV.appregistry[this.id].onlaunch = this.onlaunch;
};
