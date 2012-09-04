/*
 * NodeTV - app.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

(function() {

	// init vars
	var config
	  , version = '0.1.0a'
	// get modules
	  , fs = require('fs')
	  , git = require('gitty')
	// get os module
	  , os = require('os')
	  , qs = require('querystring')
	// get middleware
	  , express = require('express')
	  , app = express.createServer()
	  , http = require('http')
	  , jade = require('jade')
	// create socket connection
	  , io = require('socket.io').listen(app)
	  , port = 1337
	  , nslookup = require('dns').lookup
	  , netIp
	  , launched_apps = {};
	
	// console output colors
	var red = '\u001b[31m'
	  , blue = '\u001b[34m'
	  , reset = '\u001b[0m';
	
	var ipFlag = false;
	console.log('Starting NodeTV...');
	console.log('Resolving network IP...');
	resolveIp(os.hostname());	
	
	function resolveIp(hostname) {
		// determine network ip from hostname
		nslookup(hostname, function(err, addr, fam) {
			// if failed
			if (err) {
				// if there is a domain in the hostname
				if (os.hostname().split('.').length === 3) {
					// let the user know
					console.log(red + '!!! ' + reset + 'NodeTV has detected a potential issue while resolving your IP, applying workaround...');
					ipFlag = true;
					// try again without it
					var hostNoDomain = os.hostname().split('.')[0] + '.' + os.hostname().split('.')[2];
					resolveIp(hostNoDomain);
				} else {
					// otherwise tell the user something's up
					console.log(red + 'There was a problem resolving the network IP from the server\'s hostname.' + reset);
					// and quit
					process.exit();
				}
			} else {
				if (ipFlag) {
					console.log(red + '!!! ' + reset + 'NodeTV applied a workaround for an issue and may exhibit unexpected behavior.');
				}
				// all is good give NodeTV the resolved IP
				netIp = addr;
				// once IP is resolved, start the server
				// this nslookup fixes an issue for devices that are unable
				// to resolve a hostname over LAN, like Android
				init();
			}
		});
	}
	
	function init() {
		// load modules
		require('./remote.js')(io);
	
		// config server
		app.configure(function() {

			// set view directory and engine
			app.set('views', __dirname + '/views');
			app.set('view engine', 'jade');

			// methodOverride checks req.body.method for the HTTP method override
			// bodyParser parses the request body and populates req.body
			app.use(express.methodOverride());
			app.use(express.bodyParser());

			// use cookie parser
			app.use(express.cookieParser());

			// set public directory for static files
			app.use(express.static(__dirname + '/public'));

			// use router for non-static files
			app.use(app.router);

		});

		// dev env
		app.configure('development', function(){
			app.use(express.errorHandler({
				dumpExceptions: true, 
				showStack: true 
			}));
		});

		// prod env
		app.configure('production', function(){
			app.use(express.errorHandler());
		});
		
		/*
		 * http routes
		 */
	
		// render app
		app.get('/', function(req, res) {
			res.render('index', { 
				layout : 'layout',
				netIp : 'http://' + netIp,
				version : version
			});
		});
		
		// give client the app list
		app.get('/applist', function(req, res) {
			// generate a temporary unique id for each app
			var appId = function() {
				var chars = 'abcdefghijklmnopqrstuvwxyz1234567890'
				  , id = '';
				for (var i = 0; i < 10; i++) {
					id += chars.charAt((Math.random() * chars.length - 1).toFixed());
				}
				return id;
			};
			
			// get app list, create array, and send to client
			fs.readdir(__dirname + '/apps', function(err, files) {
				if (err || !files.length) {
					// if an error is thrown log it and tell the client
					console.log(err || red + '!!! ' + reset + 'No apps installed. Failed.');
					res.writeHead(500);
					res.write('Error reading app directory or no apps are installed.');
					res.end();
				} else {
					// otherwise lets serve up some apps
					var applist = [];
					// construct app object from manifest file
					files.forEach(function(val, key) {
						var appname = val
						// get manifest path
						  , manifest = __dirname + '/apps/' + appname + '/manifest.json'
						  , appconfig = JSON.parse(fs.readFileSync(manifest));
						// resolve paths to public route  
						appconfig.icon = '/apps/' + appname + appconfig.icon;
						// do the same for each script
						appconfig.scripts.forEach(function(val, key) {
							appconfig.scripts[key] = '/apps/' + appname + val;
						});
						// give id
						appconfig.id = appname + ':' + appId();
						// add to list
						applist.push(appconfig);
					});
					
					res.writeHead(200);
					res.write(JSON.stringify(applist));
					res.end();
				}
			});
		});
		
		// resolve static content for apps
		app.get('/apps/:appname/:directory/:file', function(req, res) {
			// get params
			var params = req.params
			  , appname = params.appname
			  , dir = params.directory
			  , file = params.file
			  , path = __dirname + '/apps/' + appname + '/' + dir + '/' + file;
			// determine if file is valid
			fs.exists(path, function(valid) {
				if (valid) {
					// read the file
					var asset = fs.readFileSync(path);
					// and serve it up
					res.writeHead(200);
					res.end(asset);
				} else {
					// fail
					res.writeHead(404);
					res.write('File not found.');
					res.end();
				}
			});
		});
		
		// app launcher/ui server
		app.post('/launch/:appname', function(req, res) {
		    var appname = req.params.appname
              , app_dir = __dirname + '/apps/' + appname
              , appconfig
              , manifest = app_dir + '/manifest.json';
            // sanity check
            if (fs.existsSync(manifest)) {
                appconfig = JSON.parse(fs.readFileSync(manifest));
                // determine if the view should be rendered or sent
                var splitup = appconfig.home.split('.')
                  , last = splitup.length - 1;
                // render jade template
                if (splitup[last] == 'jade') {
                    res.render(app_dir + appconfig.home, {
                        layout: false
                    });
                // render static html
                } else if (splitup[last] == 'html') {
                    res.writeHead(200);
                    fs.readFile(app_dir + appconfig.home, function(err, data) {
                        res.write(data);
                        res.end();
                    });
                }
                // require server side code
                if (appconfig.init && !(launched_apps[appname])) {
                    require(app_dir + appconfig.init)(app);
                    launched_apps[appname] = true
                }
            } else {
                res.writeHead(404);
                res.end();
            }
		});
		
		// get mounted drives
		app.get('/getMountedDisks', function(req, res) {
		    // determine os type
		    var platform = os.platform()
		      , disks = []
		      , paths = {
		      		'darwin' : '/Volumes',
		      		'linux' : '/mnt'
		      };
		    // find and parse mounted disks
		    fs.readdir(paths[platform], function(err, data) {
		    	if (err) {
		    		res.writeHead(500);
		    		res.end();
		    	} else {
		    		data.forEach(function(val, key) {
		    			var disk = {
		    				name : val,
		    				path : paths[platform] + '/' + val
		    			};
		    			disks.push(disk);
		    		});
		    		res.write(JSON.stringify(disks));
		    		res.end();
		    	}
		    });		    
		});
		
		// finds subdirectories of the passed path and returns them in an array
		app.get('/listDirectories', function(req, res) {		
			// get the path var
			var path = qs.parse(req.url.split('?')[1]).path
			  , dirs = [];
			// if the path is good then get it's dirs
			if (fs.existsSync(path)) {
				fs.readdir(path, function(err, files) {
					files.forEach(function(val,key) {
						if (fs.lstatSync(path + '/' + val).isDirectory() && val.charAt(0) !== '.') {
							dirs.push(val);
						}
					});
					res.write(JSON.stringify(dirs));
					res.end();
				});
			// otherwise fail	
			} else {
				res.writeHead(500);
				res.write('Invalid path.');
				res.end();
			}
		});
		
		// index library
		app.post('/indexLibrary', function(req, res) {
		    var path = req.body.path;
		    // scan path for movies, music, and pictures
		    require('./indexlib.js')(path, io, function(data) {
		        // respond with library
		        res.write(data);
		        res.end();
		    }, function(err) {
		        res.writeHead(500);
		        res.end();
		    });
		});

		/*
		 * start server
		 */

		app.listen(port, function() {
			console.log('NodeTV running at ' + netIp + ':' + port);
		});
	}

})();
