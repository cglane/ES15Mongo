var fs = require('fs'),
    _ = require('underscore'),
    Term = require('../models/term.js'),
    q = require('q'),
    csvWriter = require('csv-write-stream'),
    path = require('path'),
    csv = require('csv-parser');

function transExists(term,clientId,language){
  var returnVal = false;
  _.each(term.translations,function(trans){
    if(trans.clientId == clientId && trans.lang == language){
      returnVal = true;
    }
  })
  console.log(returnVal,'transExists');
  return returnVal;
}


function transVal(term,lang,callback){
  _.each(term.translations,function(trans){
    if(trans.lang == lang){
      callback(trans.val);
    }
  })
}

function addTranslationsTerm(term,usVal,clientId){
  var langs = ['de-DE','en-GB','es-SP','fr-FR','it-IT','nl-NL','pt-BR','zh-CN'],
      returnArr = [];
      _.each(langs,function(lang){
        if( term.translations.every(function(trans){
            return trans.lang !== lang;
          })){
            term.translations.push({
              clientId:clientId,
              lang:lang,
              val:usVal,
              needsTrans:true
            })
          }
      })
      term.save(function(err,term){
        if(err)throw err;
        console.log(term.key,term.group);
      });
}

function needsTrans(){
  Term.find({'softDelete':false},function(err,allTerms){
    if(err)throw err;
    _.each(allTerms,function(currTerm){
      transVal(currTerm,'en-US',function(el){
        addTranslationsTerm(currTerm,el);
      })
    });
  })
}

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
      // console.log(termRes.key,': translation added');
      deferred.resolve('translation added');
    })
  }else{
    deferred.resolve('translation not added');
    // console.log('translation not added already exists');
  }
  return deferred.promise;
}

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
    // console.log(key,": saved successfully");
    deferred.resolve('term created');
  })
  return deferred.promise;
}

function amEnglish(term){
  var returnVal = false;
  _.each(term.translations,function(el,itr){
    if (el.lang == 'en-US') returnVal = true ;
  })
  console.log(returnVal,'returnVal');
  return returnVal;
}

function addTermToDB(key,value,language,group,clientId,createdBy){
  var deferred = q.defer();
  Term.findOne({'key':key, 'group': group}).exec(function(err,term){
    if(err)throw err;
    if(!!term && amEnglish(term)){
      console.log('insertTranslation');
      insertTranslation(term,value,language,false,clientId).then(function(el){
        deferred.resolve(el);
      });
    }else{
      if(language == 'en-US'){
        console.log('createTerm');
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
            console.log(el);
          }))
          if(++itr < data.keys.length)loop();
        }loop();

    q.all(promiseArr).then(function(){
      deferred.resolve(responses);
    })

    return deferred.promise;
}


module.exports = {
  uploadFile:function(req,res){
        addFileToDB(req.body).then(function(returnStr){
          console.log(req.body,'req.body');
          res.send({'success':true,'comments': returnStr})
        });
  }

}
