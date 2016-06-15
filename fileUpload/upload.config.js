var fs = require('fs'),
    _ = require('underscore'),
    Term = require('../models/term.js'),
    path = require('path'),
    uploadCtrl = require('./upload.controller.js'),
    configDoc = require('../config.js');

    var config = {};

module.exports = function(masterPath){
  configObj.masterPath = masterPath;
  configObj.clientIds = fs.readdirSync(configObj.masterPath);
  configObj.gdgId = config.gdgId;
  //add gdg english First
  uploadCtrl.uploadFolder(configObj,configObj.clientIds[0],function(){
    console.log('GDG English Up and Loaded');
    _.each(configObj.clientIds,function(id,iteratti){
      uploadCtrl.uploadFolder(configObj,id,function(){
        if(iteratti == configObj.clientIds.length-1){
          console.log('Upload Complete!!!!!!!!!!!!!!!!');
        };
      });
    })
  })

}
