var Term = require('../models/term.js');
var _ = require('underscore');
var config = require('../config.js');
var q = require('q');
var mkdirp = require('mkdirp');
var fs = require('fs');
var AWS = require("aws-sdk");
var rollbase = require('./rbSession.js');
var getCtrl = require('./getController.js');
var merge = require('deepmerge')

//connect to rollbase

AWS.config.update({
    "accessKeyId": config.LanguageAPI.AccessKeyId,
    "secretAccessKey": config.LanguageAPI.SecretAccessKey,
    "region":'us-east-1'
 });

/**
*Calls rollbase for clientIds
*/

function getClientIds(){
    var deferred = q.defer();
    rollbase.connect(1,function(err,sessionId){
        var obj = {
          cookies:{
            'rbSessionId':sessionId,
            'rbUserRole':'90'
          }
        }
        var secondObj = {
          'json':function(clients){
            deferred.resolve(clients);
          }
        }
        getCtrl.getClients(obj,secondObj);
    });
    return deferred.promise;
};

/**
*Parses All Terms' translations for clientId
@param {string} clientId
@return {boolean} whether client has custom translations or not
*/

function idExists(clientId){
  var deferred = q.defer();
  Term.find({'translations.clientId':clientId},function(err,terms){
    deferred.resolve((terms.length > 1));
  })
  return deferred.promise;
}

function customClients(callback){
  console.log('customClients');
  var returnArr = [];
  var itr = 0;
  getClientIds().then(function(clients){
    function loop(){
      console.log(returnArr,'returnArrß');
      idExists(clients[itr].id).then(function(el){
        console.log(el,'el');
        (el)?returnArr.push(clients[itr]):null;
        if(++itr < clients.length)loop()
        else callback(returnArr);
      })
    }loop();
  })
}

/**
*Uploads local folder contents to s3 bucket with same name
*@param {string} clientId
*@param {socket} socket Passes information back to client about status of deploy
*/

function uploadFolder(clientId, socket){
  var subFolders = fs.readdirSync(__dirname + '/../../langFiles/'+clientId);
  _.each(subFolders,function(langFolder,langItr){
    var files = fs.readdirSync(__dirname + '/../../langFiles/'+clientId+"/"+ langFolder);
    _.each(files,function(jsonFile,fileItr){
      var s3 = new AWS.S3(),
          userKey = 'LangFiles/'+clientId+'/'+langFolder +'/'+jsonFile,
          readStream = fs.createReadStream(__dirname+'/../../langFiles/'+clientId+"/"+langFolder+"/"+jsonFile),
          params = {Bucket:'static.gooddonegreat.com', Key: userKey, Body: readStream};
        s3.upload(params,function(err,data){
          if(err)throw err;
          if(langItr == subFolders.length-1 && fileItr == files.length-1){
            console.log('emit amazonFolder');
            socket.emit("amazonFolder");
          }
        })
    })
  })
}

function addEnglishTranslation(englishObj,companyObj){
  for(group in englishObj){
    for(key in englishObj[group]){
      for(otherLang in companyObj){
        if(otherLang !== 'en-US'){
          if(!companyObj[otherLang][group]){
            companyObj[otherLang][group] = englishObj[group];
          }
          if(!companyObj[otherLang][group][key]){
            companyObj[otherLang][group][key] = englishObj[group][key];
          }
        }
      }
    }
  }
  return companyObj;
}

function companyTerms(clientId){
  var deferred = q.defer();
  var companyObj = {'en-US':{},'de-DE':{},'en-GB':{},'es-SP':{},'fr-FR':{},'it-IT':{},'nl-NL':{},'pt-BR':{},'zh-CN':{}};
  Term.find({'softDelete': false},function(err,terms){
    //setUp Object
    _.each(terms,function(term){
      _.each(term.translations,function(trans){
        if(companyObj[trans.lang]){
          companyObj[trans.lang][term.group] = {};
        }
      })
    })
    //setValues
    _.each(terms,function(term){
      _.each(term.translations,function(trans){
        if (trans.clientId == clientId) {
          if(companyObj[trans.lang]){
            companyObj[trans.lang][term.group][term.key] = trans.val;
          }
        }
      })
    })
    deferred.resolve(companyObj);
  })
  return deferred.promise;
}

function writeToFolder(basePath,object){
  var deferred = q.defer();
    mkdirp.sync(basePath);
      for(var lang in object){
        var langPath  =  basePath+'/'+lang
        mkdirp.sync(langPath);
        for(var group in object[lang]){
          var groupPath = basePath+'/'+lang+'/'+group+'.lang.json',
              data = JSON.stringify(object[lang][group]);
              var writeStream = fs.createWriteStream(groupPath,{flags: 'w'});
              writeStream.write(data);
              writeStream.end();
        }
      }
      deferred.resolve();
      console.log('It has been writen!!!!!!!!!!!!!!');
      return deferred.promise;
}

function writeAsJson(basePath, clientId, callback){
  var deferred = q.defer();
  var companyObj = {'en-US':{},'de-DE':{},'en-GB':{},'es-SP':{},'fr-FR':{},'it-IT':{},'nl-NL':{},'pt-BR':{},'zh-CN':{}};
  companyTerms(config.gdgId).then(function(returnObj){
    companyTerms(clientId).then(function(companyObj){
      var mergedObj = merge(returnObj,companyObj);
      var rtnObj = addEnglishTranslation(mergedObj['en-US'],mergedObj);
      writeToFolder(basePath,rtnObj).then(function(){
        deferred.resolve(basePath)
      });
    })
  })
  return deferred.promise;
}

function writeFoldersLocally(socket, clients){
  var deferred = q.defer();
  var itr = 0;
    function loop(){
      var basePath = __dirname + '/../../langFiles/'+clients[itr].id;
      socket.emit('localFolder')
      writeAsJson(basePath, clients[itr].id).then(function(folderPath){
        console.log('it has been written');
        uploadFolder(clients[itr].id,socket);
        if(++itr < clients.length)loop();
        else  deferred.resolve(clients);
      });
    }loop();
  return deferred.promise;
}

module.exports = function(socket){


  return {
    writeCustom:function(req,res){
      console.log('hit it');
        console.log(req.body,'body');
        writeFoldersLocally(socket,req.body).then(function(){
          res.send({success:true})
        });
    },
    writeAllSocket: function(req,res){
      getClientIds().then(function(clients){
        writeFoldersLocally(socket,clients).then(function(){
          res.send({success:true})
        })
      })

    },

  }
}
