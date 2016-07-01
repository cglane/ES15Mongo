var fs = require('fs'),
    _ = require('underscore'),
    Term = require('../models/term.js'),
    q = require('q'),
    csvWriter = require('csv-write-stream'),
    path = require('path'),
    csv = require('csv-parser');

/**
*Checks if translation already exists in term translation array
*@param {object} term The term who's translations will be checked
*@param {string} clientId ClientId to be referenced
*@param {string} language Language to be referenced
*@return {boolean} if client translation exists for language
*/

function transExists(term,clientId,language){
  var returnVal = false;
  _.each(term.translations,function(trans){
    if(trans.clientId == clientId && trans.lang == language){
      returnVal = true;
    }
  })
  return returnVal;
}

/**
*Searches for lanugage specific translation
*@param {object} term The term who's translations will be checked
*@param {string} clientId ClientId to be referenced
*@param {string} language Language to be referenced
*@return {string} returns the translation value of translation object
*/

function transVal(term,lang,callback){
  _.each(term.translations,function(trans){
    if(trans.lang == lang){
      callback(trans.val);
    }
  })
}

/**
*Adds translation to term object
*@param {object} term
*@param {string} value
*@param {string} language
*@param {needsTrans} boolean
*@param {string} clientId
*/

function insertTranslation(term,value,language,needsTrans,clientId){
  var deferred = q.defer();
  if(!transExists(term,clientId,language)){
    term.translations.push({
      clientId:clientId,
      lang:language,
      val:value,
      needsTrans:needsTrans
    })
    term.save(function(err,termRes){
      if(err)throw err;
      deferred.resolve('translation added');
    })
  }else{
    deferred.resolve('translation not added');
  }
  return deferred.promise;
}

/**
*Creates a new term in the db with an initial translation
*@param {string} key
*@param {string} value
*@param {string} language
*@param {string} group
*@param {string} clientId
*@param {string} createTerm
*/

function createTerm(key,value,language,group,clientId,createdBy){
  var deferred = q.defer();
  var newTerm = new Term({
    group : group,
    key: key,
    createdBy:createdBy,
    translations:[{
      clientId:clientId,
      lang:language,
      val:value,
      needsTrans:false
    }],
    comments:'First Upload',
  })
  newTerm.save(function(err,item){
    if(err)throw err;
    deferred.resolve('term created');
  })
  return deferred.promise;
}

/**
*Makes sure english translation exists for term
*@param {object} term Contains all translation objects to be referenced
*@return {boolean}
*/

function amEnglish(term){
  var returnVal = false;
  _.each(term.translations,function(el,itr){
    if (el.lang == 'en-US') returnVal = true ;
  })
  return returnVal;
}

/**
*Adds passed values to DB as a new Term or as a translation, throwing error on duplicates
*@param {string} key
*@param {string} value Value of translation
*@param {string} group
*@param {string} clientId
*@param {string} createdBy
*@return {promise}
*/

function addTermToDB(key,value,language,group,clientId,createdBy){
  var deferred = q.defer();
  Term.findOne({'key':key, 'group': group}).exec(function(err,term){
    if(err)throw err;
    if(!!term && amEnglish(term)){
      insertTranslation(term,value,language,false,clientId).then(function(el){
        deferred.resolve(el);
      });
    }else{
      if(language == 'en-US'){
        createTerm(key,value,language,group,clientId,createdBy).then(function(el){
          deferred.resolve(el);
        });
      }else{
        deferred.resolve('no english eqivalent');
      }
    }
  })
  return deferred.promise;
}

/**
*Adds json array of object to mongodb as new translations or Terms
*@param {array} keys Array of term keys
*@param {object} jsonData all the translation values of keys in language
*@param {string} language
*@param {string} group
*@param {string} clientId
*@param {string} createdBy
*@return {promise}
*/

function addFileToDB(data){
  var deferred = q.defer();
  var responses = [];
  var promiseArr = [],
      itr = 0;
        function loop(){
          promiseArr.push(addTermToDB(
            data.keys[itr],
            data.jsonData[data.keys[itr]],
            data.language,
            data.group,
            data.clientId,
            data.createdBy)
            .then(function(el){
              responses.push(el);
          }))
          if(++itr < data.keys.length)loop();
        }loop();

    q.all(promiseArr).then(function(){
      deferred.resolve(responses);
    })

    return deferred.promise;
}


module.exports = {
  /**
  *@module
  *Uploads a json array of objects to mongodb
  *@param {object} req.body array of key names
  */
  uploadFile:function(req,res){
        addFileToDB(req.body).then(function(returnStr){
          res.send({'success':true,'comments': returnStr})
        });
  }

}
