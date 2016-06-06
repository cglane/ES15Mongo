var fs = require('fs'),
    _ = require('underscore'),
    Term = require('../models/term.js'),
    q = require('q'),
    uploadPaths = ['en-US','de-DE','en-GB','es-SP','fr-FR','it-IT','nl-NL','pt-BR','zh-CN'],
    clientId = '12345678910',
    csvWriter = require('csv-write-stream'),
    writeCtrl = require('../controllers/writeController.js'),
    path = require('path'),
    csv = require('csv-parser'),
    uploadCtrl = require('./upload.controller.js');

module.exports = function(){

  var promiseArr = [],
    itr = 0;
  function loop(){
    promiseArr.push(uploadCtrl.uploadFolder(itr,function(){
      console.log('complete');
    }))
    if(++itr < uploadPaths.length)loop();
  }loop();
}
