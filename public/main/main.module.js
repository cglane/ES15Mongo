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
      'xeditable'
    ])
    .run(function(editableOptions) {
      editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    })
    .config(function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider

          // HOME STATES AND NESTED VIEWS ========================================
          .state('login', {
              url: '/',
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
            url:'/view_term/:key',
            controller:'TermController',
            templateUrl: 'templates/view-term-tpl.html'
          })
  });






})();
