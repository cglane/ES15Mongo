var Promise = require('es6-promise').Promise;
var Term = require('../models/term.js');

module.exports = {

  editTerm: function(req,res,next){
      var re = req.body,
          _id =  req.params._id;

      Term.findOneAndUpdate({
          '_id': _id
        },{$set:{
          'group':re.group,
          'createdBy':re.createdBy,
          'updatedAt': new Date(),
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
      }

}
