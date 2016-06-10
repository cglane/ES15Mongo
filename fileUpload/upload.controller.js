var fs = require('fs'),
    _ = require('underscore'),
    Term = require('../models/term.js'),
    q = require('q'),
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
      deferred.resolve(termRes.key);
    })
  }else{
    deferred.resolve('fail');
    // console.log('translation not added already exists');
  }
  return deferred.promise;
}

function createTerm(key,value,language,group,clientId){
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

function addTermToDB(key,value,language,group,clientId){
  var deferred = q.defer();
  Term.findOne({'key':key, 'group': group}).exec(function(err,term){
    if(err)throw err;
    if(term && amEnglish(term)){
      insertTranslation(term,value,language,false,clientId).then(function(el){
        // console.log(el,'inserted');
        deferred.resolve();
      });
    }else{
      if(language == 'en-US'){
        createTerm(key,value,language,group,clientId).then(function(el){
          // console.log(el, 'created');
          deferred.resolve();
        });
      }else{
        deferred.resolve();
      }
    }
  })
  return deferred.promise;
}

function addFileToDB(data){
  var deferred = q.defer();
  var promiseArr = [],
      itr = 0;
        function loop(){
          promiseArr.push(addTermToDB(
            data.keys[itr],
            data.jsonData[data.keys[itr]],
            data.language,
            data.group,
            data.clientId)
            .then(function(el){
            // console.log('#');
          }))
          if(++itr < data.keys.length)loop();
        }loop();

    q.all(promiseArr).then(function(){
      console.log('file Uploaded');
      console.log(data.language, data.group);
      deferred.resolve();
    })

    return deferred.promise;
}


module.exports = {

  uploadFolder:function(config, clientId,callback){
        var companyPath = config.masterPath + clientId,
            langFolders = fs.readdirSync(companyPath),
            promiseArr = [],
            deferred = q.defer();
            for (var j = 0; j < langFolders.length; j++) {
                var langPath = (companyPath + '/'+ langFolders[j]),
                    langFiles = fs.readdirSync(langPath);
                //read each file and add to DB
                for (var i = 0; i < langFiles.length; i++) {
                  //check if file is readable else skip
                  try{
                    var filePath = (langPath + '/'+ langFiles[i]),
                        fileData = fs.readFileSync(filePath),
                        fileInfo = {};
                        fileInfo.group = langFiles[i].split('.')[0],
                        fileInfo.jsonData = JSON.parse(fileData),
                        fileInfo.keys  = Object.keys(fileInfo.jsonData),
                        fileInfo.language = langFolders[j],
                        fileInfo.clientId = clientId;
                        //add file to Database with all keys/values
                        promiseArr.push(addFileToDB(fileInfo));
                  }catch(e){
                    if(e.code === 'ENOENT'){
                      console.log('file not found');
                      continue;
                    }else{
                      console.log(e,'e');
                    }
                  }
                }
              }
              q.all(promiseArr).then(function(){
                callback();
              })

            }
}
