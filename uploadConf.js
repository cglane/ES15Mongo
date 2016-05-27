var fs = require('fs'),
    _ = require('underscore'),
    Term = require('./models/term.js'),
    q = require('q'),
    uploadPaths = ['en-US','de-DE','en-GB','es-SP','fr-FR','it-IT','nl-NL','pt-BR','zh-CN'],
    other = ['en-US','de-DE','en-GB','es-SP','fr-FR','it-IT','nl-NL','pt-BR','zh-CN'],
    clientId = '123456880';


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
      val:value
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
  Term.findOne({'key':key}).exec(function(err,term){
    if(err)throw err;
    if(term && amEnglish(term)){
      insertTranslation(term,value,language).then(function(el){
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
function deleteAll(){
  Term.remove(function(err){
    if(err)throw err;
    console.log('collection deleted');
  })
}
function logAll(){
  Term.find({'softDelete':false},function(err,res){
    if(err)throw err;
    _.each(res,function(el){
      console.log(el.key,'key');
      console.log(el.translations);
    })
    // (res.length > 1)? console.log(res.length,'#Files'): console.log('nothing in db');;
  })
}
function logOneTerm(){
  Term.find({'key':'postProjectSurvey'},function(err,res){
    console.log(res,'res');
  })
}

function uploadFolder(val,callback){
      var folderPath = uploadPaths[val],
          language = folderPath,
          files = fs.readdirSync('./i18n/'+folderPath),
          promiseArr = [];
          for (var j = 0; j < files.length; j++) {
              var location = './i18n/'+folderPath+'/'+files[j],
                  fileData = fs.readFileSync(location,'utf-8');
                var group = files[j].split('.')[0],
                    fileArr = files[j].split('.'),
                    jsonData = JSON.parse(fileData),
                    keys  = Object.keys(jsonData),
                    itr = 0;
                    function loop(){
                      promiseArr.push(addToDB(keys[itr],jsonData[keys[itr]],language,group).then(function(el){
                      }))
                      if(++itr < keys.length)loop();
                    }loop();
                    return q.all(promiseArr).then(function(){
                      callback();
                    })
                }
          }



module.exports = function(){
  // logOneTerm();
// logAll();
// deleteAll();
  // uploadFolder();
  var promiseArr = [],
    itr = 0;
  function loop(){
    promiseArr.push(uploadFolder(itr,function(){
    }))
    if(++itr < uploadPaths.length)loop();
  }loop();
}