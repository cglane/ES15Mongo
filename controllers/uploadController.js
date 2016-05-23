var Term = require('../models/term.js'),
      _ = require('underscore'),
    fs = require('fs');

function translationExists(transArray, value,companyId,language){
  var returnVal = false;
  _.each(transArray,function(resObj){
      if(resObj.clientId == companyId && resObj.lang == language) {
        console.log('translation exists');
        returnVal = true;
      }
  });
  return returnVal;
}

function addToDB(companyId,group,key,val,language){
    Term.find({'key':key}).exec(function(err,resTerm){
      if(err)throw err;
      if(resTerm.length > 1){
        addTranslation(resTerm,companyId,key,val,language);
      }else{
        createNewTerm(companyId,group,language,key,val);
      }
    })
}

function createNewTerm(companyId,group, language, key, val){
    var newTerm = new Term({
      group: group,
      key:key,
      translations:[{
        lang:language,
        val:val,
        clientId:companyId
      }],
      createdOn: new Date(),
      softDelete: false
    })
    // console.log(newTerm,'newTerm');
    newTerm.save(function(err,termRes){
      if(err)throw err;
      // console.log(termRes.translations,'termRes');
      console.log(termRes.key, 'created successfully')
    })
}

function addTranslation(rtnTerm,companyId,key,value,language){
    if(!translationExists(rtnTerm[0].translations,value,companyId,language)){
      //insert
      rtnTerm[0].translations.push({
        clientId:companyId,
        lang: language,
        val:value
      })
      rtnTerm[0].save(function(err,newTerm){
        if(err)throw err;
        console.log(newTerm.key, ' translation added Successfully');
        return true;
      })
    }else{
      console.log('already exists');
      return false;
    }
}

module.exports = {

    includeTranslation: function(req,res,next){
      Term.find({key:req.params.key}).exec(function(err,termRes){
        if(err)throw err;
        res.send(
          {'success':
          addTranslation(termRes,req.body.clientId,req.params.key,req.body.val,req.body.lang)
        });
      })
  },

  uploadFile: function(req,res,next){
    var companyId = req.params.companyId,
        group = req.params.group,
        language= req.params.language,
        uploadedTerms = 0,
        promiseArr = [];

        fs.readFile(req.body.url,'utf8',function(err,data){
          if(err){
            return console.log(err);
          }
            var uploadedData = JSON.parse(data);
            for(key in uploadedData){
              addToDB(companyId,group,key,uploadedData[key],language)
            }
            res.send({success:'file read successfully'});
        })
      }


    }
