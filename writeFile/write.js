var Term = require('../models/term.js');
var _ = require('underscore');
var config = require('../config.js');
var q = require('q');
var mkdirp = require('mkdirp');
var fs = require('fs');
var AWS = require("aws-sdk");


var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.AWS_BUCKET_NAME;
AWS.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});

function uploadFolder(bucketName,path,userId){
  var s3 = new AWS.S3(),
      userKey = 'wpg_c/'+userId + '/app/i18n' ;

  s3.createBucket({Bucket:bucketName},function(){
    var params = {Bucket:bucketName, Key: userKey, Body: path};
    s3.putObject(params,function(err,data){
      if(err)throw err;
      console.log('Successfully Uploaded' + userId + ' to AWS!');
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
 callback(fakeId);
}



module.exports = {

  writeAll: function(){
    getCompanyIds(function(companyIds){
      for (var i = 0; i < companyIds.length; i++) {
        var basePath = __dirname + '/../langFiles/'+companyIds[i];
        writeAsJson(basePath, companyIds[i],function(folderPath){
          //add Some stuff to AWS upload
          // uploadFolder('bucketName',folderPath,companyIds[i]);
        });
      }
    })
  },
  testLocalHost:function(){
    var basePath = __dirname + '/../../WPG-2.0/WPG/app/i18n';
    writeAsJson(basePath,'12345678');
  }

}
