var fs = require('fs'),
    _ = require('underscore'),
    Term = require('../models/term.js'),
    q = require('q'),
    uploadPaths = ['en-US','de-DE','en-GB','es-SP','fr-FR','it-IT','nl-NL','pt-BR','zh-CN'],
    clientId = '12345678910',
    csvWriter = require('csv-write-stream'),
    writeCtrl = require('../controllers/writeController.js'),
    path = require('path'),
    csv = require('csv-parser');

function transExists(term,clientId,language){
  var returnVal = false;
  _.each(term.translations,function(trans){
    if(trans.clientId == clientId && trans.lang == language){
      returnVal = true;
    }
  })
  return returnVal;
}


function transVal(term,lang,callback){
  _.each(term.translations,function(trans){
    if(trans.lang == lang){
      callback(trans.val);
    }
  })
}

function addTranslationsTerm(term,usVal){
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

function insertTranslation(term,value,language,needsTrans){
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
      deferred.resolve(termRes.key);
    })
  }else{
    deferred.resolve('fail');
    // console.log('translation not added already exists');
  }
  return deferred.promise;
}

function createTerm(key,value,language,group){
  var deferred = q.defer();
  var newTerm = new Term({
    group : group,
    key: key,
    translations:[{
      clientId:clientId,
      lang:language,
      val:value,
      needsTrans:false
    }],
    createdBy:'Charles Lane',
    comments:'First Upload',
  })
  newTerm.save(function(err,item){
    if(err)throw err;
    // console.log(key,": saved successfully");
    deferred.resolve(item.key);
  })
  return deferred.promise;
}
function amEnglish(term){
  var returnVal = false;
  _.each(term.translations,function(el,itr){
    if (el.lang == 'en-US') returnVal = true ;
  })
  return returnVal;
}

function addToDB(key,value,language,group){
  var deferred = q.defer();
  Term.findOne({'key':key, 'group': group}).exec(function(err,term){
    if(err)throw err;
    if(term && amEnglish(term)){
      insertTranslation(term,value,language,false).then(function(el){
        console.log(el,'inserted');
        deferred.resolve();
      });
    }else{
      if(language == 'en-US'){
        createTerm(key,value,language,group).then(function(el){
          console.log(el, 'created');
          deferred.resolve();
        });
      }
    }
  })
  return deferred.promise;
}
module.exports = {

  uploadFolder:function(options,callback){
        var folderPath = uploadPaths[0],
            language = folderPath,
            files = fs.readdirSync('./i18n/'+folderPath),
            promiseArr = [];
            for (var j = 0; j < files.length; j++) {
                var location = './i18n/'+folderPath+'/'+files[j];
                try{
                  var fileData = fs.readFileSync(location,'utf-8') ;
                }catch(e){
                  if(e.code === 'ENOENT'){
                    console.log('file not found');
                    continue;
                  }else{
                    throw e;
                  }
                }

                var group = files[j].split('.')[0],
                    fileArr = files[j].split('.'),
                    jsonData = JSON.parse(fileData),
                    keys  = Object.keys(jsonData);
                    itr = 0;
                      function loop(){
                        promiseArr.push(addToDB(keys[itr],jsonData[keys[itr]],language,group).then(function(el){
                          console.log('#');
                        }))
                        if(++itr < keys.length)loop();
                      }loop();
                  }
                  return q.all(promiseArr).then(function(){
                    callback();
                  })
            }
}
