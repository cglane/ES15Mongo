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

/**
*Inserts the english translation value for other languages in term if translation does not exist
*@param {object} englishObj An object with all groups and keys/values of english translations
*@param {object} companyObj All the language objects of a merged client language file
*@return {object} The companyObj with english translations where other languages missing
*/
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

/**
*Iterates through all company translations organizing by groups and languages
*@param {string} clientId
*@return {object} A master object of all company Terms in i18n format
*/

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

/**
*Writes folder locally iterating through object and writing files
*@param {string} basePath path for creating the folder--outside of the local directory
*@param {object} object merged client language file organized by language
*/

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

/**
*Aggregates company specific translations and merges with GDG 2.0 translations, then calling writeToFolder
* writes folders locally so they can be uploaded to S3
*@param {string} basePath path for writing folder locally
*@param {string} clientId
*/

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


/**
*Merges client translation data with GDG 2.0 translations for all clients, writes locally and uploads to Amazon S3 bucket
*@param {socket}
*@param {array} clients array of client objects
*/

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
        res.send('cloudflare issue');
        writeFoldersLocally(socket,req.body).then(function(){
          // res.send({success:true})
        });
    },
    writeAllSocket: function(req,res){
      res.send('cloudflare issue');
      getClientIds().then(function(clients){
        writeFoldersLocally(socket,clients).then(function(){
          // res.send({success:true})
        })
      })

    },

  }
}
