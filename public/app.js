/**
 * @name gdgSettingsApp
 * @description
 * App to allow TPMs to manage portal settings for their clients
 */
import angular from 'angular';
import uirouter from 'angular-ui-router';

//config
import router from './router.js';
//services
import MainService from './service/main.service.js';
import LoginService from './service/login.service.js';
import SocketService from './service/socket.service.js';

//controllers
import CompanyGroupsController from './controller/company.controller.js';
import CompanyTermController from './controller/companyTerm.controller.js';
import DeployController from './controller/DeployController.js';
import LoginController from './controller/login.controller.js';
import MainController from './controller/main.controller.js';
import modalInstanceController from './controller/modal.instance.controller.js';
import TemplatesController from './controller/templates-ctrl.js';
import TermController from './controller/term.controller.js';
import UploadController from './controller/upload.controller.js';

angular.module('gdgLangApp', [uirouter])
  //config
  .config(router)
  //services
  .service('MainService', MainService)
  //controllers
  .controller('CompanyGroupsController', CompanyGroupsController)
  .controller('CompanyTermController', CompanyTermController)
  .controller('DeployController', DeployController)
  .controller('LoginController', LoginController)
  .controller('MainController', MainController)
  .controller('modalInstanceController', modalInstanceController)
  .controller('TemplatesController', TemplatesController)
  .controller('TermController', TermController)
  .controller('UploadController', UploadController)
angular.bootstrap(document, ['gdgLangApp']);
