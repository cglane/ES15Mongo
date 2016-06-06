var Promise = require('es6-promise').Promise;
var Term = require('../models/term.js');
var _ = require('underscore');
var getCtrl = require('./getController.js');
var config = require('../config.js');
var q = require('q');

  function extractTranslations(term,language){
    var returnArr = [];
    _.each(term.translations,function(trans){
      if(trans.lang === language)returnArr.push(trans);
    })
    return returnArr;
  }

  function rateTranslation(gdgId,companyId,term,language){
    var gdgTrans,companyTrans;
    _.each(extractTranslations(term,language),function(trans){
      if(trans.clientId == gdgId)gdgTrans = trans;
      if(trans.clientId == companyId)companyTrans = trans;
    })
    return (companyTrans)? companyTrans:gdgTrans;
  }

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

  function writeToFolder(object){

  }


module.exports = {

  getOneTerm: function(req,res,next){
    Term.findOne({'key':req.params.key,'group':req.params.group},function(err,term){
      if(err)throw err;
      res.send(term)
    })
  },

  getAllTerms:function(req,res,next){
    Term.find({'softDelete':false},function(err,allTerms){
      if(err)throw err;
      res.send(allTerms);
    })
  },

  getAllTranslationsByGroup:function(req,res,next){
    var group = req.params.group,
        companyId = parseInt(req.params.companyId),
        language = req.params.language,
        gdgId = 12309280,
        returnObj={};

    Term.find({'group':group},function(err, terms){
      if(err)throw err;
      _.each(terms,function(term){
        var acptTrans = rateTranslation(gdgId,companyId,term,language);
        returnObj[term.key] = acptTrans.val;
      })
      res.send(returnObj);
    })
  },

  getCompanyTerms:function(req,res, next){
    companyTerms(req.params.clientId).then(function(obj){
      res.send(obj);
    })
  },

  getNeedTranslation:function(req,res,next){
    var returnArr = [];
    Term.find({'translations.needsTrans': true},function(err,allTerms){
      res.send(allTerms);
    })
  },

  getCompanies:function(req,res,next){
    var returnObj = {};
    Term.find({'softDelete':false},function(err,allTerms){
      _.each(allTerms,function(terms){
        _.each(terms.translations,function(trans){
          console.log(trans.clientId);
          returnObj[trans.clientId] = trans.clientId;
        })
      })
      res.send(returnObj)
    })
  },

  getFullCompanyTerms: function(req,res,next){
    var companyObj = {'en-US':{},'de-DE':{},'en-GB':{},'es-SP':{},'fr-FR':{},'it-IT':{},'nl-NL':{},'pt-BR':{},'zh-CN':{}};
    companyTerms(config.gdgId).then(function(returnObj){
      companyTerms(req.params.clientId).then(function(companyObj){
        for(var lang in returnObj){
          for(var group in returnObj[lang]){
            for(var term in returnObj[lang][group]){
              if(companyObj[lang][group][term]){
                returnObj[lang][group][term] = companyObj[lang][group][term];
              }
            }
          }
        }
        res.send(returnObj)
      })
    })
  }


}
