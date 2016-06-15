var rbSession = require('../lib/rbSession.js');
var request = require('request');
var schedule = require('node-schedule');
var write = require('../writeFile/write.js');

function rbLogin(customerId, user, pass, callback) {
  var url = 'https://www.gdg.do/rest/api/login?loginName=' + user + '&password=' + pass + '&custId=' + customerId + '&output=json';
  request.get(url, function(error, response, body) {
    res = JSON.parse(body);
    if (res.sessionId) callback(null, res.sessionId);
    else callback(res.message);
  });
};

module.exports = {
  /**
   * @route GET '/settings/logout'
   * @description
   * Log the user out of Rollbase and out of the settings app
   * @params {cookie} rbSessionId Rollbase REST session id
   */
  logOut: function(req, res, next) {
    var url = 'https://www.gdg.do/rest/api/logout?sessionId=' + req.cookies.rbSessionId;
    rbSession.disconnect(req.cookies.rbSessionId, function(err, rbRes) {
      if (err) res.status(500).send('error logging out');
      else {
        res.clearCookie('rbSessionId');
        res.clearCookie('rbUserId');
        res.clearCookie('rbUserName');
        write.writeAll();
        res.redirect('/#/login');
      }
    });
  },

  /**
   * @route GET '/settings/doLogin'
   * @description
   * Log the user in and return user data as cookies
   *
   * @param {body} username gdg.do login name
   * @param {body} password gdg.do password
   *
   * @returns {cookie} rbSessionId
   * @returns {cookie} rbUserId
   * @returns {cookie} rbUserName
   * @returns {cookie} rbUserRole
   *
   * @redirect '/settings/#/clients' (app 'home' page)
   */
  doLogin: function(req, res, next) {
    rbLogin(null, req.body.username, req.body.password,
      function(err, sessionId) {

        var sessionLength = 9000000;
        res.cookie('rbSessionId', sessionId, { maxAge: sessionLength, httpOnly: true });
        var url = 'https://www.gdg.do/rest/api/selectQuery?' +
          'sessionId=' + sessionId +
          '&startRow=0&maxRows=1&output=json' +
          '&query=SELECT id, name, role FROM USER WHERE loginName="'+req.body.username+'"';

        request.get(url, function(err, rbRes, body) {
          if (err) res.send(err);
          else {
            var user;
            try {
              user = JSON.parse(body);
            } catch(err) {
              res.send('Error: ' + err);
            }
            if (user.length) {
              res.cookie('rbUserId', user[0][0], { maxAge: sessionLength, httpOnly: true });
              res.cookie('rbUserName', user[0][1], { maxAge: sessionLength, httpOnly: true });
              res.cookie('rbUserRole', user[0][2], { maxAge: sessionLength, httpOnly: true });
              //set trigger for write user files
              setTimeout(function () {
                write.writeAll();
              }, sessionLength);

              res.send({'success': true,'userName':user[0][1]});

            }else{
              res.send({'success': false});
            }
          }
        });
    });
  },


};
