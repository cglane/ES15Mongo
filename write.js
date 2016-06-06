var Term = require('./models/term.js');
var _ = require('underscore');
var config = require('./config.js');
var q = require('q');
var mkdirp = require('mkdirp');
var fs = require('fs');

function companyTerms(clientId){
  var deferred = q.defer();
  var companyObj = {'en-US':{},'de-DE':{},'en-GB':{},'es-SP':{},'fr-FR':{},'it-IT':{},'nl-NL':{},'pt-BR':{},'zh-CN':{}};
  Term.find({'softDelete': false},function(err,terms){
    //setUp Object
    _.each(terms,function(term){
      _.each(term.translations,function(trans){
        companyObj[trans.lang][term.group] = {};
      })
    })
    _.each(terms,function(term){
      _.each(term.translations,function(trans){
        if (trans.clientId == clientId) {
          companyObj[trans.lang][term.group][term.key] = trans.val;
        }
      })
    })
    deferred.resolve(companyObj);
  })
  return deferred.promise;
}

function writeToFolder(basePath,object){
    mkdirp.sync(basePath);
      for(var lang in object){
        var langPath  =  basePath+lang
        mkdirp.sync(langPath);
        for(var group in object[lang]){
          var groupPath = basePath+lang+'/'+group+'.lang.json',
              data = JSON.stringify(object[lang][group]);
              var writeStream = fs.createWriteStream(groupPath,{flags: 'w'});
              writeStream.write(data);
              writeStream.end();
        }
      }
}

function writeAsJson(basePath, clientId){
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
      writeToFolder(basePath,returnObj);
    })
  })
}

var basePath = __dirname + '/../testerJson/'

module.exports = function(){

  writeAsJson(basePath, 16015839);

}
