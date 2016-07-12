var Promise = require('es6-promise').Promise;
var Term = require('../models/term.js');
var _ = require('underscore');
var getCtrl = require('./getController.js');
var config = require('../config.js');
var q = require('q');
var request = require('request');
var rollbase = require('./rbSession.js');
var merge = require('deepmerge');
var objectID= require('mongodb').ObjectID;
  /**
  *Extract specific langage translations from Term
  *@param {object} term The term, who's array of translations will be parsed
  *@param {string} language The matching language to be returned
  *@return {array} All translations matching language param
  */

  function extractTranslations(term,language){
    var returnArr = [];
    _.each(term.translations,function(trans){
      if(trans.lang === language)returnArr.push(trans);
    })
    return returnArr;
  };

  /**
  *Parses translations for company translations
  *@param {string} gdgId The default id for GDG 2.0 Code
  *@param {string} companyId The company identification
  *@param {object} Term the term, who's array of translations will be parsed
  *@param {string} language The specific language that should be matched
  *@return {object} Returns companyTranslation if it exists, otherwise returning the GDG translation
  */

  function rateTranslation(gdgId,companyId,term,language){
    var gdgTrans,companyTrans;
    _.each(extractTranslations(term,language),function(trans){
      if(trans.clientId == gdgId)gdgTrans = trans;
      if(trans.clientId == companyId)companyTrans = trans;
    })
    return (companyTrans)? companyTrans:gdgTrans;
  };

  /**
  *Agregates company translations in i18n format, only returning custom content
  *@param{string} clientId The client who's terms will be aggregated
  *@return{object} i18n language object organized by languge/group/termKey
  */

  // function companyTerms(clientId){
  //   var deferred = q.defer();
  //   var companyObj = {'en-US':{},'de-DE':{},'en-GB':{},'es-SP':{},'fr-FR':{},'it-IT':{},'nl-NL':{},'pt-BR':{},'zh-CN':{}};
  //   // Term.find({'translations':{$elemMatch:{'clientId':clientId}}, 'softDelete': false})
  //   //           .aggregate([{$unwind:{path:"$translations", preserveNullAndEmptyArrays: true}}]) function(err,terms){
  //   //
  //   //   deferred.resolve(companyObj);
  //   // })
  //   Term.aggregate([
  //     {
  //       "$match":{
  //         "translations.clientId": parseInt(clientId)
  //       }
  //     },
  //     {
  //       "$unwind": "$translations"
  //     },
  //     {
  //       "$match":{
  //         "translations.clientId":parseInt(clientId)
  //       }
  //     },
  //     {
  //       "$project":{
  //         _id: 0,
  //         lang: '$translations.lang',
  //         group: 1,
  //         key : '$key'
  //       }
  //     },
  //     {
  //       '$group':{
  //         _id: {lang:"$lang", group: "$group"},
  //         keys: {"$push": "$key"}
  //       }
  //     }
  //   ],
  //     function(err, results){
  //       var list = {};
  //       for (var i = 0; i < results.length; i++) {
  //         if(!list[results[i]._id.lang]){
  //           list[results[i]._id.lang] = {};
  //         }
  //         else if(!list[results[i]._id.lang][results[i]._id.group]){
  //           list[results[i]._id.lang][results[i]._id.group] = results[i].keys;
  //         }
  //       }
  //       deferred.resolve(list);
  //
  //     })
  //     return deferred.promise;
  // };
  function companyTerms(clientId){
    var deferred = q.defer();
    var companyObj = {'en-US':{},'de-DE':{},'en-GB':{},'es-SP':{},'fr-FR':{},'it-IT':{},'nl-NL':{},'pt-BR':{},'zh-CN':{}};
    Term.find({'translations':{$elemMatch:{'clientId':clientId}}, 'softDelete': false}, function(err,terms){
      //setUp Object
      _.each(terms,function(term){
        _.each(term.translations,function(trans){
          if(companyObj[trans.lang]){
            companyObj[trans.lang][term.group] = {};
          }
        })
      })
      //insert CompanyTranslations
      _.each(terms,function(term){
        _.each(term.translations,function(trans){
          if (companyObj[trans.lang]) {
            companyObj[trans.lang][term.group][term.key] = trans.val;
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

/* Returns all terms with key value of a certain group*/

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

  /**Cross reference rollbase clientIds with mongoDB clientIds*/

  getCompanyNames:function(req,res,next){
    var itr = 0;
    var companyArr = req.body.data;
    var returnArr = [];
    var clients = Term.distinct('translations.clientId',function(err,clients){
        function loop(){
          if(_.contains(clients,companyArr[itr].id))returnArr.push(companyArr[itr])
          if(++itr < companyArr.length) loop()
          else(res.send(returnArr))
        }loop()
    });
  },

  /**Check all translation objects for needTrans field value of true*/
  getNeedTranslation:function(req,res,next){
    var returnArr = [];
    Term.find({'translations.needsTrans': true},function(err,allTerms){
      res.send(allTerms);
    })
  },

  /**Rollbase call for all ClientIds*/

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
