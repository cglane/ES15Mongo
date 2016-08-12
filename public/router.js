routes.$inject = ['$stateProvider', '$urlRouterProvider'];
export default function routes($sP, $uRP) {
  $uRP.otherwise('/login');
  $sP.state('login', {
      url: '/login',
      controller:'LoginController',
      template:require('./templates/login-tpl.html')
  })
  .state("main",{
    url:'/main',
    controller:'MainController',
    template:require( './templates/main-tpl.html')
  })
  .state("view_term",{
    url:'/view_term/:key/:group',
    controller:'TermController',
    template:require( './templates/view-term-tpl.html')
  })
  .state("companies",{
    url:'/companies',
    controller:'CompanyController',
    template:require('./templates/companies-tpl.html')
  })
  .state("view_companies",{
    url:'/view_company/:clientId/:clientName',
    controller:'CompanyGroupsController',
    template:require('./templates/view-companies-tpl.html')
  })
  .state("view_company_term",{
    url:'/view_company_term/:group/:key/:clientId',
    controller:'CompanyTermController',
    template:require('./templates/view-company-term-tpl.html')
  })
  // .state("view_templates"),{
  //   url:'/view_templates',
  //   template: require('./templates/template-tpl.html'),
  //   controller: 'TemplatesController',
  // }
}






})();
