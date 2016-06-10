
var mongoose = require('mongoose'),
    Promise = require('es6-promise').Promise,
    Term = require('../models/term.js'),
    createCtrl = require("../controllers/createController.js"),
    editCtrl = require("../controllers/editController.js"),
    uploadCtrl = require('../controllers/uploadController.js'),
    getCtrl = require("../controllers/getController.js"),
    loginCtrl = require("../controllers/loginController.js");
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
  //============Login Logout ===================//
  apiRoutes.post('/login/',loginCtrl.doLogin);

  apiRoutes.post('/logout/',loginCtrl.logOut);

  //============Write Files======================//

  // apiRoutes.get('/write_i18n/:clientId',getCtrl.writei18n);

  //============Upload and Edit==================//
  apiRoutes.post('/create_term',createCtrl.createTerm);

  apiRoutes.post('/create_translation',createCtrl.insertTranslation)

  apiRoutes.post('/include_translation/:key',uploadCtrl.includeTranslation);

  apiRoutes.post('/upload_create_file/:group/:companyId/:language',uploadCtrl.uploadFile);

  apiRoutes.put('/edit_term/:_id',editCtrl.editTerm);

  apiRoutes.put('/edit_translation/:termId/:transId',editCtrl.editTranslation);

  //============GET Term information=============//

  apiRoutes.get('/get_one_term/:key/:group',getCtrl.getOneTerm);

  apiRoutes.get('/get_all_terms/',getCtrl.getAllTerms);

  apiRoutes.get('/get_all_translations_group/:group/:language/:companyId',getCtrl.getAllTranslationsByGroup);

  apiRoutes.get('/get_company_terms/:clientId',getCtrl.getCompanyTerms);

  apiRoutes.get('/get_need_translation/',getCtrl.getNeedTranslation);

  apiRoutes.get('/get_companies/',getCtrl.getCompanies);

  apiRoutes.get('/get_full_company_terms/:clientId', getCtrl.getFullCompanyTerms)

//=============Change To Soft Delete============//

  apiRoutes.delete('/soft_delete/:_id',editCtrl.softDelete);

  apiRoutes.delete('/delete_translation/:termId/:transId',editCtrl.deleteTranslation)

}
