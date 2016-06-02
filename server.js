//=================Packages============//
var express 	= require('express');
var app         = express();
var methodOverride = require('method-override');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

//Config File
var config = require('./config');


//================Configuration==========//

var port = process.env.PORT || 3000;
// mongoose.connect(config.database); // connect to database
mongoose.connect('mongodb://localhost/myappdatabase');
//connect to public html files
app.use(express.static(__dirname + '/public'));

// / use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
require('./uploadConf.js')();
// require('./write.js')();


// ===============================================
app.listen(port);


console.log('Magic happens at http://localhost:' + port);
