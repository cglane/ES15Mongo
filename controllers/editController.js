var Promise = require('es6-promise').Promise;
var Term = require('../models/term.js');

 module.exports = {

   /**Edit pre-existing term with new information*/

  editTerm: function(req,res,next){
      var re = req.body,
          _id =  req.params._id;
      Term.findOneAndUpdate({
          '_id': _id
        },{$set:{
          'group':re.group,
          'updatedAt': re.updatedAt,
          'updatedBy': re.updatedBy,
          'comments': re.comments
              }
            },{
              new:true
            },function(err,thisTerm){
              if(err)throw err;
              res.send(thisTerm);
            })
          },

  /**Sets softDelete field as true*/

  softDelete: function(req,res){
      var _id = req.params._id;
      Term.findOneAndUpdate({
        '_id':_id
        },{$set:{
          'softDelete':true
          }
        },{
          new:true
        },function(err,thisTerm){
          if(err)throw err;
          res.send(thisTerm);
        })
      },

    /**Updates information within specific translation object*/

    editTranslation:function(req,res){
      Term.findOneAndUpdate(
        {'_id':req.params.termId,'translations._id':req.params.transId},
        {$set:{
          'updatedBy':req.body.updatedBy,
          'translations.$.needsTrans':req.body.needsTrans,
          'translations.$.val':req.body.val,
          'translations.$.lang':req.body.lang,
          'translations.$.clientId':req.body.clientId
        }
      },{
        new:true
      },function(err,term){
        if(err)throw err;
        res.send(term);
        });
    },

    /** Removes translation object from Term array*/

    deleteTranslation:function(req,res){
      Term.findOneAndUpdate({'_id':req.params.termId},
        {$pull:{
          'translations':{'_id':req.params.transId}
        }
      },function(err,term){
        if(err)throw err;
         res.send(term);
      })
    }

}
