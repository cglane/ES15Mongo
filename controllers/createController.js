var Term = require('../models/term.js');
var _ = require('underscore');

/**
*Checks if data matches any of pre-existing translations
*@function
*@param {array} translations - array of translations objects
*@param {object} data - single translation data set
*@return {boolean} Boolean value does or does not exist in list
*/

function translationExists(translations,data){
  var rtnVal = false;
  _.each(translations,function(trans){
    if(trans.clientId == data.clientId && trans.lang == data.lang){
      rtnVal = true;
    }
  })
  return rtnVal;
}

module.exports = {

/**Creates A New Term if doesn't already exist*/

  createTerm: function(req,res,next){
    var re = req.body,
      newTerm = new Term({
        group: re.group,
        key: re.key,
        translations:[],
        createdBy: re.createdBy,
        comments: re.comments,
        softDelete: re.softDelete
      });
      Term.findOne({key:re.key,group:re.group},function(err,term){
        if(err)throw err;
        if(!term){
          newTerm.save(function(err,termRes){
            if(err)throw err;
            res.json({success:true,data:termRes});
          })
        }else{
          res.json({message:'Term already exists',success:false})
        }
      });
    },

    /**Inserts a Translation into Term's array of translations*/

    insertTranslation:function(req,res){
      Term.findOne({_id:req.body.termId},function(err,term){
        if(err)throw err;
        if(!translationExists(term.translations,req.body)){
          term.translations.push({
            clientId:req.body.clientId,
            lang:req.body.lang,
            val:req.body.val
          })
          term.save(function(err,term){
            if(err)throw err;
            res.send({success: true})
          })
        }else{
          res.send({success:false})
        }
      })
    }


}
