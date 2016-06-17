
var mongoose = require('mongoose'),
    Promise = require('es6-promise').Promise,
    Term = require('../models/term.js'),
    createCtrl = require("../controllers/createController.js"),
    editCtrl = require("../controllers/editController.js"),
    getCtrl = require("../controllers/getController.js"),
    uploadCtrl = require('../controllers/uploadController.js');

module.exports = function (apiRoutes) {

  //============Write Files======================//

  // apiRoutes.get('/write_i18n/:clientId',getCtrl.writei18n);

  //============Upload and Edit==================//
  apiRoutes.post('/create_term',createCtrl.createTerm);

  apiRoutes.post('/create_translation',createCtrl.insertTranslation)


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

  apiRoutes.get('/get_companyids',getCtrl.getClients);

  apiRoutes.get('/get_all_clientIds',getCtrl.getAllClientIds);
//=============Change To Soft Delete============//

  apiRoutes.delete('/soft_delete/:_id',editCtrl.softDelete);

  apiRoutes.delete('/delete_translation/:termId/:transId',editCtrl.deleteTranslation);

//=============Upload Json Folder ============//

  apiRoutes.post('/uploadFile/',uploadCtrl.uploadFile);

}
