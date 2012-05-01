
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes');

var app = module.exports = express.createServer();
var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();

var io = require('socket.io').listen(app);
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({store:sessionStore,secret:'jimly',key:'express.sid'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});
app.configure('production', function(){
  app.use(express.errorHandler()); 
});


io.configure(function(){
	if(process.env.VMC_APP_PORT) {
		io.set('transports', [
		//	'websocket',
			'flashsocket',
			'htmlfile',
			'xhr-polling',
			'jsonp-polling'
			]);
	}
	var parseCookie = require('connect').utils.parseCookie;
	var Session = require('connect').middleware.session.Session;
	io.set('authorization',function(data,accept){
		if(data.headers.cookie){
			data.cookie = parseCookie(data.headers.cookie);
			data.sessionID = data.cookie['express.sid'];
			data.sessionStore = sessionStore;
			sessionStore.get(data.sessionID,function(err,session){
				if(err || !session){
					accept('Error',false);
				}else{
					data.session = new Session(data,session);
					accept(null,true);
				}
			});
		}else{
			accept('No cookie get',false);
		}
		accept(null,true);
	});
});
// Routes
routes.chat(io);

app.get('/login',routes.login);
app.get('/',function(req,res){
	routes.index(req,res);
});
app.get('/:uid',function(req,res){
	var room = req.params.uid;
	if(room === 'favicon.ico')
		return;
	console.log(req.params.uid);
	routes.invite(req,res,room);
});

app.listen(process.env.VCAP_APP_PORT|| 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
