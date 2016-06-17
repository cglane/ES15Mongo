var Promise = require('es6-promise').Promise;
var Term = require('../models/term.js');
var _ = require('underscore');
var getCtrl = require('./getController.js');
var config = require('../config.js');
var q = require('q');
var request = require('request');
var rollbase = require('./rbSession.js');

  function extractTranslations(term,language){
    var returnArr = [];
    _.each(term.translations,function(trans){
      if(trans.lang === language)returnArr.push(trans);
    })
    return returnArr;
  };

  function rateTranslation(gdgId,companyId,term,language){
    var gdgTrans,companyTrans;
    _.each(extractTranslations(term,language),function(trans){
      if(trans.clientId == gdgId)gdgTrans = trans;
      if(trans.clientId == companyId)companyTrans = trans;
    })
    return (companyTrans)? companyTrans:gdgTrans;
  };

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
  };



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
        gdgId = config.gdgId,
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
  },
  getClients: function(req, res, next) {
    if (!req.cookies.rbSessionId) {
      res.send({error: 'logouts'});
    } else if (req.cookies.rbUserRole === '90') {
      var url = 'https://www.gdg.do/rest/api/selectQuery?' +
        'sessionId=' + req.cookies.rbSessionId +
        '&startRow=0&maxRows=20000&output=json' +
        '&query=SELECT id, name FROM CUSTOMER WHERE gdg_2_0=1 ORDER BY name DESC';
      request.get(url, function(err, rbRes, bodyString) {
        var body;
        try { body = JSON.parse(bodyString); }
        catch (err) { res.send(err) }
        if (body.message === 'Session expired or invalid login credentials') {
          res.send({error: 'logouts'});
        } else {
          var i = body.length, zones = [];
          while (i--) {
            zones.push({
              id: body[i][0],
              name: body[i][1]
            });
          }
          res.json(zones);
        }
      });
    } else {
      var url = 'https://www.gdg.do/rest/api/getRecord?' +
        'sessionId=' + req.cookies.rbSessionId +
        '&id=' + req.cookies.rbUserId +
        '&objName=USER&composite=1&objNames=CUSTOMER&fieldList=id,name,gdg_2_0&output=json';
      request.get(url, function(err, rbRes, bodyString) {
        console.log(bodyString);
        var body;
        try { body = JSON.parse(bodyString); }
        catch (err) { res.send(err) }
        if (body.message === 'Session expired or invalid login credentials') {
          res.send({error: 'logout'});
        } else {
          //only return GDG 2.0 clients
          res.json(body.composite.filter(function(client) { return client.gdg_2_0; }));
        }
      });
    }
  },
  getAllClientIds:function(req,res){
        rollbase.connect(1,function(err,sessionId){
            var obj = {
              cookies:{
                'rbSessionId':sessionId,
                'rbUserRole':'90'
              }
            }
            var secondObj = {
              'json':function(clients){
                res.send(clients)
              }
            }
            module.exports.getClients(obj,secondObj);
        });
  }

}
