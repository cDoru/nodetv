/*
 * NodeTV - app.js
 * Author: Gordon Hall
 * 
 * Released under MIT license - see LICENSE
 */

(function() {

	// init vars
	var config,
	// get modules
	    fs = require('fs'),
	    git = require('gitty'),
	// get middleware
	    express = require('express'),
	    app = express(),
	    http = require('http'),
	    server = http.createServer(app),
	    jade = require('jade'),
	// create socket connection
	    io = require('socket.io').listen(server);
	
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
			layout: 'layout' 
		});
	});




	/*
	 * start server
	 */

	app.listen(1337, function() {
		console.log('NodeTV running at port 1337');
	});

})();
