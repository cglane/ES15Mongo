var fs = require('fs'),
    _ = require('underscore'),
    Term = require('./models/term.js'),
    q = require('q'),
    uploadPath = ['en-US','de-DE','en-GB','es-SP','fr-FR','it-IT','nl-NL','pt-BR','zh-CN'],
    clientId = '12309280';


function transExists(term,clientId,language){
  var returnVal = false;
  _.each(term.translations,function(trans){
    if(trans.clientId == clientId && trans.lang == language){
      returnVal = true;
    }
  })
  return returnVal;
}

function insertTranslation(term,value,language){
  var deferred = q.defer();
  if(!transExists(term,clientId,language)){
    term.translations.push({
      clientId:clientId,
      lang:language,
      val:value
    })
    term.save(function(err,termRes){
      if(err)throw err;
      console.log(termRes.key,': translation added');
      deferred.resolve();
    })
  }else{
    deferred.resolve();
    console.log('translation not added already exists');
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
      val:value
    }],
    createdBy:'Charles Lane',
    comments:'First Upload',
  })
  newTerm.save(function(err,item){
    if(err)throw err;
    console.log(key,": saved successfully");
    deferred.resolve();
  })
  return deferred.promise;
}

function addToDB(key,value,language,group){
  var deferred = q.defer();
  Term.findOne({'key':key}).exec(function(err,term){
    if(err)throw err;
    if(term){
      insertTranslation(term,value,language).then(function(){
        deferred.resolve();
      });
    }else{
      createTerm(key,value,language,group).then(function(){
        deferred.resolve();
      });
    }
  })
  return deferred.promise;
}
function deleteAll(){
  Term.remove(function(err){
    if(err)throw err;
    console.log('collection deleted');
  })
}
function logAll(){
  Term.find({'softDelete':false},function(err,res){
    if(err)throw err;
    console.log(res,'res');
    // (res.length > 1)? console.log(res.length,'#Files'): console.log('nothing in db');;
  })
}
function logOneTerm(){
  Term.find({'key':'pwdLabel'},function(err,res){
    console.log(res,'res');
  })
}
function uploadAll(){
  _.each(uploadPath,function(folderPath){
    var language = folderPath;
    fs.readdir('./i18n'+'/'+folderPath,function(err,files){
      if(err)console.log(err)
      _.each(files,function(filePath,itr){
        var group = filePath.split('.')[0],
            location = './i18n/'+folderPath+'/'+filePath,
            fileArr = filePath.split('.');
        if(fileArr[fileArr.length-1] == 'json'){
          fs.readFile(location,'utf-8',function(err,fileData){
            if(err)throw err;
            var jsonData = JSON.parse(fileData);
              _.each(jsonData,function(el,key){
                addToDB(key,fileData[key],language,group).then(function(){
                  console.log(key,'key');
                });
              })
          })
        }
      })
    })
  })
}

module.exports = function(){
  // logOneTerm();
logAll();
// deleteAll();
// uploadAll();

}
