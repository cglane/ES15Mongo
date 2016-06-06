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

    var config = {};
    config.masterPath = (__dirname + '/../i18n/');
    config.clientIds = fs.readdirSync(config.masterPath);
    config.gdgId = '12345678';

module.exports = function(){
  //add gdg english First
  uploadCtrl.uploadFolder(config,config.clientIds[0],function(){
    console.log('gdg up and loaded');
    _.each(config.clientIds,function(id,iteratti){
      uploadCtrl.uploadFolder(config,id,function(){
        console.log(iteratti,'iteratti');
        console.log(config.clientIds.length-1);
        if(iteratti == config.clientIds.length-1){
          console.log('Upload Complete!!!!!!!!!!!!!!!!');
        };
      });
    })
  })

}
