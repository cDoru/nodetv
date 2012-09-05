/*
 * NodeTV - indexlib.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

module.exports = function(path, io, success, error) {
    // take path and index the filesystem and generate object
    // divided by media type and send a socket message to client
    // for each found media that passes inspection
    var filetypes = {
        'mp3' : 'audio',
        'ogg' : 'audio',
        'm4a' : 'audio',
        'aac' : 'audio',
        'mp4' : 'video',
        'm4v' : 'video',
        'avi' : 'video',
        'mov' : 'video',
        'jpg' : 'photo',
        'jpeg' : 'photo',
        'jpe' : 'photo',
        'png' : 'photo',
        'gif' : 'photo'   
    } , library = {
        video : [],
        audio : [],
        photo : []
    } , fs = require('fs')
      , currentDir = path;
    // start scanning over files in the specified directory
	console.log('Scanning for media at ' + path);
    scan(currentDir);
    // when it's done, call success
    success.call(this, library);
    // recursive scanning function
    function scan(path) {
    	// sychronous so we know when it's finished
    	var files = fs.readdirSync(path)
    	  , total = 0;
    	files.forEach(function(val, key) {
    		// make sure its a file
    		if (fs.lstatSync(path + '/' + val).isFile()) {
    			// make sure it's supported
    			var type = filetypes[fileExt(val)];
    			if (type) {
    				var media = {
    					type : type,
    					name : val.substr(0, val.lastIndexOf('.')),
    					path : path + '/' + val
    				};
    				library[type].push(media);
    				// increment the total indexed files
    				total++;
    				// on every 6th file (stack overflow concerns) message user
    				if (total % 6 === 0) {
        				// message the client saying we are scanning
    		    		io.sockets.emit('libscan', {
    		    			path : val
    		    		});
    		    	}
    			}
    		// if it is a directory, then scan it too
    		} else if (fs.lstatSync(path + '/' + val).isDirectory() && val.charAt(0) !== '.') {
    			scan(path + '/' + val);
    		}
    	});
    }
    // helper function for getting file extention
    function fileExt(filename) {
    	var ext = filename.lastIndexOf('.');
    	return (ext < 0) ? '' : filename.substr(ext + 1);
    }
    // when completed, fire callback or if error occurs fire
    // error function
}
