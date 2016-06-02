// var Term = require('../models/term.js');
// var _ = require('underscore');
// var getCtrl = require('./getController.js');
// var config = require('../config.js');
// var q = require('q');
// var mkdirp = require('mkdirp');
//
// function companyTerms(clientId){
//   var deferred = q.defer();
//   var companyObj = {'en-US':{},'de-DE':{},'en-GB':{},'es-SP':{},'fr-FR':{},'it-IT':{},'nl-NL':{},'pt-BR':{},'zh-CN':{}};
//   Term.find({'softDelete': false},function(err,terms){
//     //setUp Object
//     _.each(terms,function(term){
//       _.each(term.translations,function(trans){
//         companyObj[trans.lang][term.group] = {};
//       })
//     })
//     _.each(terms,function(term){
//       _.each(term.translations,function(trans){
//         if (trans.clientId == clientId) {
//           companyObj[trans.lang][term.group][term.key] = trans.val;
//         }
//       })
//     })
//     deferred.resolve(companyObj);
//   })
//   return deferred.promise;
// }
//
// function writeToFolder(object){
//   mkdirp('./i18n',function(err){
//     if(err)throw err;
//     for(var lang in object){
//       mkdirp('./i18n/'+lang,function(err){
//         if(err)throw err;
//         for(var group in lang){
//           fs.writeFile('./i18n/'+lang+'/'+group, JSON.stringify(object[lang][group]),function(err){
//             if(err)throw err;
//           })
//         }
//     })
//   })
// }
// module.exports = {
//
//   writei18n:function(req,res,next){
//     var companyObj = {'en-US':{},'de-DE':{},'en-GB':{},'es-SP':{},'fr-FR':{},'it-IT':{},'nl-NL':{},'pt-BR':{},'zh-CN':{}};
//     var count = 0;
//     companyTerms(config.gdgId).then(function(returnObj){
//       companyTerms(req.params.clientId).then(function(companyObj){
//         for(var lang in returnObj){
//           for(var group in returnObj[lang]){
//             for(var term in returnObj[lang][group]){
//               if(_.contains(companyObj[lang][group], term)){
//                 returnObj[lang][group][term] = companyObj[lang][group][term];
//               }
//             }
//           }
//         }
//         writeToFolder(returnObj);
//       })
//     })
//   }
//
//
//
// }
