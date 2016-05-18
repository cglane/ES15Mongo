
var mongoose = require('mongoose'),
    Promise = require('es6-promise').Promise,
    Term = require('../models/term.js'),
    createCtrl = require("../controllers/createController.js"),
    editCtrl = require("../controllers/editController.js"),
    uploadCtrl = require('../controllers/uploadController.js');
module.exports = function (apiRoutes) {

  apiRoutes.get('/hello', function(req, res) {
    console.log('ehlsjl;')
  	res.json({ message: 'Welcome to the coolest API on earth!' });
  });

  apiRoutes.post('/create_term',createCtrl.createTerm);

  apiRoutes.put('/edit_term/:_id',editCtrl.editTerm);

  apiRoutes.delete('/soft_delete/:_id',editCtrl.softDelete);

  apiRoutes.post('/add_translation/:key',uploadCtrl.addTranslation);

  apiRoutes.delete('/delete_term',function(req,res){
      Term.remove(function(err){
        if(err)throw err;
        res.send('Collection deleted')
        console.log('collection deleted')
      })
  })




}
