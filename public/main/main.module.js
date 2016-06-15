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
      'angularFileUpload'
    ])
    .run(function(editableOptions) {
      editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    })
    .config(function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/companies');

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
          .state("view_group",{
            url:'/view_group/:group',
            controller:'GroupController',
            templateUrl: 'templates/view-group-tpl.html'
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
            url:'/view_company/:clientId',
            controller:'CompanyGroupsController',
            templateUrl:'templates/view-companies-tpl.html'
          })
          .state("view_company_term",{
            url:'/view_company_term/:group/:key/:clientId',
            controller:'CompanyTermController',
            templateUrl:'templates/view-company-term-tpl.html'
          })
  });






})();
