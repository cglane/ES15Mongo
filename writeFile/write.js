var Term = require('../models/term.js');
var _ = require('underscore');
var config = require('../config.js');
var q = require('q');
var mkdirp = require('mkdirp');
var fs = require('fs');
var AWS = require("aws-sdk");
var rollbase = require('../controllers/rbSession.js');
var getCtrl = require('../controllers/getController.js');
//connect to rollbase

AWS.config.update({
    "accessKeyId": 'AKIAJKPUEUUGKYD5SNLA',
    "secretAccessKey": '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',
    "region":'us-east-1'
 });

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

function uploadFolder(clientId){
  var deferred = q.defer();
  var subFolders = fs.readdirSync(__dirname + '/../../langFiles/'+clientId);
  _.each(subFolders,function(langFolder,langItr){
    var files = fs.readdirSync(__dirname + '/../../langFiles/'+clientId+"/"+ langFolder);
    _.each(files,function(jsonFile,fileItr){
      //pass to s3
      var s3 = new AWS.S3(),
          // userKey = 'wpg_c/'+clientId+'/app/i18n/'+langFolder,
          userKey = 'testingLangFiles/'+clientId+'/'+langFolder +'/'+jsonFile,
          readStream = fs.createReadStream(__dirname+'/../../langFiles/'+clientId+"/"+langFolder+"/"+jsonFile),
          params = {Bucket:'static.gooddonegreat.com', Key: userKey, Body: readStream};
        s3.upload(params,function(err,data){
          if(err)throw err;
          if(langItr == langFolder.length-1 && fileItr == jsonFile.length-1){
            deferred.resolve();
          }
        })
    })
  })
  return deferred.promise;
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
            console.log(otherLang,key);
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
  var companyObj = {'en-US':{},'de-DE':{},'en-GB':{},'es-SP':{},'fr-FR':{},'it-IT':{},'nl-NL':{},'pt-BR':{},'zh-CN':{}};
  companyTerms(config.gdgId).then(function(returnObj){
    companyTerms(clientId).then(function(companyObj){
      for(var lang in returnObj){
        for(var group in returnObj[lang]){
          for(var term in returnObj[lang][group]){
            if(companyObj[lang][group][term]){
              returnObj[lang][group][term] = companyObj[lang][group][term];
            }
          }
        }
      }
      var rtnObj = addEnglishTranslation(returnObj['en-US'],returnObj);
      writeToFolder(basePath,rtnObj).then(function(){
        callback(basePath);
      });
    })
  })
}

function writeFoldersLocally(){
  var deferred = q.defer();
  var itr = 0;
  getClientIds().then(function(clients){
    function loop(){
      var basePath = __dirname + '/../../langFiles/'+clients[itr].id;
      writeAsJson(basePath, clients[itr].id,function(folderPath){
        console.log(client[itr].id, ': written locally');
      });
      if(++itr < clients.length)loop();
    }loop();
    deferred.resolve(clients);
  })
  return deferred.promise;
}


module.exports = {

  writeAll: function(){
    writeFoldersLocally().then(function(clients){
      var itr = 0;
      function loop(){
        console.log(clients[itr].id,'upload');
        uploadFolder(clients[itr].id).then(function(){
          console.log(clients[itr].id,'complete');
          if(++itr < clients.length) loop();
        })
      }loop();
      console.log('All Files Written And Uploaded!!!!!!!!');
    })
  },

  testLocalHost:function(){
    var basePath = __dirname + '/../../WPG-2.0/WPG/app/i18n';
    writeAsJson(basePath,'12345678');
  }

}
