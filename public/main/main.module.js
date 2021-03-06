(function () {
  "use strict";

  var underscore = angular.module('underscore', []);
          underscore.factory('_', function() {
              return window._;
          });
  var jquery = angular.module('jquery', []);
          jquery.factory('$', function() {
          return window.$;
        });


  angular
    .module('main', [
      'ngRoute',
      'ui.router',
      'underscore',
      'jquery',
      'xeditable',
      'ui.bootstrap',
      'ngFileUpload',
      'angularFileUpload',
      'btford.socket-io'
    ])
    .factory('socket', function (socketFactory) {
    return socketFactory();
    })
    .run(function(editableOptions) {
      editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    })
    .config(function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/login');

      $stateProvider

          // HOME STATES AND NESTED VIEWS ========================================
          .state('login', {
              url: '/login',
              controller:'LoginController',
              templateUrl: 'templates/login-tpl.html'
          })
          .state("main",{
            url:'/main',
            controller:'MainController',
            templateUrl: 'templates/main-tpl.html'
          })
          .state("view_term",{
            url:'/view_term/:key/:group',
            controller:'TermController',
            templateUrl: 'templates/view-term-tpl.html'
          })
          .state("companies",{
            url:'/companies',
            controller:'CompanyController',
            templateUrl:'templates/companies-tpl.html'
          })
          .state("view_companies",{
            url:'/view_company/:clientId/:clientName',
            controller:'CompanyGroupsController',
            templateUrl:'templates/view-companies-tpl.html'
          })
          .state("view_company_term",{
            url:'/view_company_term/:group/:key/:clientId',
            controller:'CompanyTermController',
            templateUrl:'templates/view-company-term-tpl.html'
          })
          // .state("view_templates"),{
          //   url:'/view_templates',
          //   template: require('../templates/template-tpl.html'),
          //   controller: 'TemplatesController',
          // }
  });






})();
