var request = require('request');
var config = require('../config.js');
var rbSession = {};

rbSession.connect = function(customerId, user, pass, callback) {
  //optional usage -- don't pass in user and password and default to environment variables instead
  if (arguments.length === 2) {
    callback = user;
    user = config.rollbase.user;
    pass = config.rollbase.pass;
  }

  user = encodeURIComponent(user);
  pass = encodeURIComponent(pass);

  var url = 'https://' + (process.env.GDG_PREFIX || 'www') + '.gdg.do/rest/api/login?loginName='+user+'&password='+pass+'&custId='+customerId+'&output=json';
  request.get(url, function(error, response, body) {
    console.log('login', body);
    res = JSON.parse(body);
    if (res.sessionId) callback(null, res.sessionId);
    else callback(res.message);
  });
};

rbSession.disconnect = function(sessionId, callback) {
  var url = 'https://' + (process.env.GDG_PREFIX || 'www') + '.gdg.do/rest/api/logout?sessionId='+sessionId+'&output=json';
  request.get(url, function(error, response, body) {
    res = JSON.parse(body);
    if (callback) callback(error, res);
  });
};

module.exports = rbSession;
