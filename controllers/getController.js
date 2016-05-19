var Promise = require('es6-promise').Promise;
var Term = require('../models/term.js');
var _ = require('underscore');


  function extractLanguage(term,language){
    var returnArr = [];
    _.each(term.translations,function(trans){
      if(trans.lang === language)returnArr.push(trans);
    })
    return returnArr;
  }

  function rateTranslation(translations,gdgId,companyId){
    var gdgTrans,companyTrans;
    _.each(translations,function(trans){
      if(trans.clientId == gdgId)gdgTrans = trans;
      if(trans.clientId == companyId)companyTrans = trans;
    })
    return (companyTrans)? companyTrans:gdgTrans;
  }

module.exports = {

  getOneTerm: function(req,res,next){
    Term.findOne({'key':req.params.key},function(err,term){
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
        var transl = extractLanguage(term,language);
        var prefTrans = rateTranslation(transl,gdgId,companyId);
        returnObj[term.key] = prefTrans.val;
      })
      console.log(returnObj,'returnObj');
      res.send(returnObj);
    })
  },
  getCompanyTranslations:function(req,res,next){
    console.log('aslkdjlkajsdjkl');
    var clientId = req.params.clientId,
        companyArr  = [],
        returnArr = [];
        Term.find({'softDelete':false},function(err,allTerms){
          _.each(allTerms,function(term){
            _.each(term.translations,function(trans){
              if(trans.clientId == clientId){
                trans.group = term.group;
                companyArr.push(trans);
              };
            });
          });
          _.each(companyArr,function(obj){
            var key = obj.group + obj.key;
            returnArr[key] = obj.val;
          })
          console.log(returnArr,'returnArr');
          res.send(returnArr);
        })

  }

}
