//=================Packages============//
var express 	= require('express');
var app         = express();
var methodOverride = require('method-override');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var cookieParser = require('cookie-parser');
var loginCtrl = require("./controllers/loginController.js");

//Config File
var config = require('./config');
var writeFile = require('./writeFile/write.js')

//================Configuration==========//

var port = process.env.PORT || 3000;
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
 // http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
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

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router();
//routes for api
require('./api/routes.js')(apiRoutes);
//adding prefix of api to all fo these routes
app.use('/api', apiRoutes);
// require('./fileUpload/upload.config.js')(__dirname+'/i18n/');
// require('./writeFile/write.js').rollbase();
// writeFile.testLocalHost();
// require('./writeFile/write.js').writeAll();
// ===============================================
app.listen(port);


console.log('Magic happens at http://localhost:' + port);
