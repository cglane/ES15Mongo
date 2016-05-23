
var mongoose = require('mongoose'),
    Promise = require('es6-promise').Promise,
    Term = require('../models/term.js'),
    createCtrl = require("../controllers/createController.js"),
    editCtrl = require("../controllers/editController.js"),
    uploadCtrl = require('../controllers/uploadController.js'),
    getCtrl = require("../controllers/getController.js");

module.exports = function (apiRoutes) {

  apiRoutes.get('/hello', function(req, res) {
    console.log('ehlsjl;')
  	res.json({ message: 'Welcome to the coolest API on earth!' });
  });
  apiRoutes.delete('/delete_term/',function(req,res){
    Term.remove(function(err){
      if(err)throw err;
      res.send('Collection deleted')
    })
  })
  //============Upload and Edit==================//
  apiRoutes.post('/create_term',createCtrl.createTerm);

  apiRoutes.post('/include_translation/:key',uploadCtrl.includeTranslation);

  apiRoutes.post('/upload_create_file/:group/:companyId/:language',uploadCtrl.uploadFile);

  apiRoutes.put('/edit_term/:_id',editCtrl.editTerm);

  //============GET Term information=============//
  apiRoutes.get('/get_one_term/:key',getCtrl.getOneTerm);

  apiRoutes.get('/get_all_terms/',getCtrl.getAllTerms);

  apiRoutes.get('/get_all_translations_group/:group/:language/:companyId',getCtrl.getAllTranslationsByGroup);

//=============Change To Soft Delete============//
  apiRoutes.delete('/soft_delete/:_id',editCtrl.softDelete);

}
