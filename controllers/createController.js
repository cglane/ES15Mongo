var Promise = require('es6-promise').Promise;
var Term = require('../models/term.js');

module.exports = {
  createTerm: function(req,res,next){
  var re = req.body,
    newTerm = new Term({
      group: re.group,
      key: re.key,
      translations:[{
        lang: re.lang,
        val : re.val
      }],
      createdBy: re.createdBy,
      comments: re.comments,
      softDelete: re.softDelete
  });
Term.findOne({key:re.key},function(err,term){
  if(err)throw err;
  if(!term){
    newTerm.save(function(err,termRes){
      console.log(termRes,'termRes')
      res.json(termRes);
    })
  }else{
    console.log('already exists');
    res.json({message:'Term already exists'})
  }
});
}

}
