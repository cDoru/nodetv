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
    }, library = {
        video : [],
        audio : [],
        photo : []
    };
    // when completed, fire callback or if error occurs fire
    // error function
}
