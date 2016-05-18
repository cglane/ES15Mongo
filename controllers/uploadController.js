var Promise = require('es6-promise').Promise;
var Term = require('../models/term.js');
var _ = require('underscore');

function translationExists(transArray, currTrans){
  var returnVal = false;
  _.each(transArray,function(resObj){
      if(resObj.val === currTrans.val) {
        returnVal = true;
      }
  });
  return returnVal;
}

module.exports = {
  addTranslation: function(req,res,next){
    var key = req.params.key;
    Term.findOne({'key':key},function(err,termRes){
      if(err)throw err;
      if(termRes){
        //if there is no matching translation add to array
        if(!translationExists(termRes.translations,req.body)){
          console.log('translation does not exist')
        }else{
          console.log('translation already exists')
        }
      }
    })
  }

}
