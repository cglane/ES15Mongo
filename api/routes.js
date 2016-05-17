
var mongoose = require('mongoose');
var Promise = require('es6-promise').Promise;
var Term = require('../models/term.js');
module.exports = function (apiRoutes) {

  apiRoutes.get('/hello', function(req, res) {
    console.log('ehlsjl;')
  	res.json({ message: 'Welcome to the coolest API on earth!' });
  });

}
