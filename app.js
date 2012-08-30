/*
 * NodeTV - app.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

(function() {

	// init vars
	var config
	  , version = '0.1.0'
	// get modules
	  , fs = require('fs')
	  , git = require('gitty')
	// get os module
	  , os = require('os')
	// get middleware
	  , express = require('express')
	  , app = express.createServer()
	  , http = require('http')
	  , jade = require('jade')
	// create socket connection
	  , io = require('socket.io').listen(app)
	  , port = 1337
	  , nslookup = require('dns').lookup
	  , netIp;
	
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
		
		// server client the app list
		app.get('/applist', function(req, res) {
			
			// get app list, create array, and send to client
			
			// for now fake doing work and return 500
			setTimeout(function() {
				res.writeHead(500);
				res.end();
			}, 3000);
			
		});

		/*
		 * start server
		 */

		app.listen(port, function() {
			console.log('NodeTV running at ' + netIp + ':' + port);
		});
	}

})();
