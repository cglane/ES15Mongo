//=================Packages============//
var express 	= require('express');
var app         = express();
var methodOverride = require('method-override');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var cookieParser = require('cookie-parser');
var loginCtrl = require("./controllers/loginController.js");
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var config = require('./config');
var writeFile = require('./writeFile/write.js');
//================Configuration==========//

var port = config.PORT || 8080;

// mongoose.connect('mongodb://localhost:27017/myappdatabase');
mongoose.connect("gdg_admin:G8Q'j]'ZS}d[]Uvs@mongo.gdg.do:27017/gdg_langs");


//connect to public html files
app.use(express.static(__dirname + '/public'));

// / use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//login logout
app.post('/api/login/',loginCtrl.doLogin);
app.post('/api/logout/',loginCtrl.logOut);


//check for sessionId
app.use(function(req,res,next){
  if(req.cookies.rbSessionId === undefined){
    res.send('noSessId');
    console.log('sessionId has expired');
  }else if(req.cookies.rbSessionId){
    next();
  }
})



// use morgan to log requests to the console
app.use(morgan('dev'));

//config response for server
app.use(methodOverride());

// ## CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization,x-access-token');
    res.header('Access-Control-Allow-Credentials', 'true');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

///----socket connection----///
io.on('connection', function(socket){
  console.log('socket connected');
  require('./api/routes.js')(apiRoutes,socket);
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router();
//routes for api
//adding prefix of api to all fo these routes
app.use('/api', apiRoutes);
// ===============================================
server.listen(port);


console.log('Magic happens at http://localhost:' + port);
