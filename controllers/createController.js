var Term = require('../models/term.js');
var _ = require('underscore');


function translationExists(translations,data){
  var rtnVal = false;
  _.each(translations,function(trans){
    if(trans.clientId == data.clientId || trans.lang == data.lang){
      rtnVal = true;
    }
  })
  return rtnVal;
}

module.exports = {

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
      Term.findOne({key:re.key},function(err,term){
        if(err)throw err;
        if(!term){
          newTerm.save(function(err,termRes){
            if(err)throw err;
            writeFiles.writeAll();
            res.json({success:true,data:termRes});
          })
        }else{
          res.json({message:'Term already exists',success:false})
        }
      });
    },

    insertTranslation:function(req,res){
      console.log(req.body,'req.body');
      Term.findOne({_id:req.body.termId},function(err,term){
        if(err)throw err;
        if(!translationExists(term.translations,req.body)){
          //insert Translation
          term.translations.push({
            clientId:req.body.clientId,
            lang:req.body.lang,
            val:req.body.val
          })
          term.save(function(err,term){
            if(err)throw err;
            writeFiles.writeAll();
            res.send({success: true})
          })
        }else{
          res.send({success:false})
        }
      })
    }


}
