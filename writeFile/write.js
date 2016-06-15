var Term = require('../models/term.js');
var _ = require('underscore');
var config = require('../config.js');
var q = require('q');
var mkdirp = require('mkdirp');
var fs = require('fs');
var AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: config.LanguageAPI.accessKeyId,
   secretAccessKey: config.LanguageAPI.secretAccessKey
 });

function uploadFolder(clientId){
  var s3 = new AWS.S3(),
      userKey = 'wpg_c/app/i18n/'+clientId ;

    var params = {Bucket:'static.gooddonegreat.com/', Key: userKey, Body: fs.readFileSync(__dirname+'/../langFiles/'+userId)};
    s3.putObject(params,function(err,data){
      if(err)throw err;
      console.log('Successfully Uploaded' + userId + ' to AWS!');
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

function getCompanyIds(callback){
  var realIds = [
    '12345678',
   '13520310',
   '14791960',
   '16015839',
   '20221348',
   '25724430',
   '112345678234567',
 ];
 var fakeId = ['99999999999'];
 callback(realIds);
}



module.exports = {

  writeAll: function(){
    getCompanyIds(function(clientIds){
      for (var i = 0; i < clientIds.length; i++) {
        var basePath = __dirname + '/../../langFiles/'+clientIds[i];
        writeAsJson(basePath, clientIds[i],function(folderPath){
          // add Some stuff to AWS upload
          // uploadFolder(clientIds[i]);
          console.log(folderPath,'folderPath');
        });
      }
    })
  },
  testLocalHost:function(){
    var basePath = __dirname + '/../../WPG-2.0/WPG/app/i18n';
    writeAsJson(basePath,'12345678');
  }

}
