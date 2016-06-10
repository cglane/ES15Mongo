
(function(){
"use strict";

angular
  .module('main')
  .controller('CompanyController',function($uibModal,$stateParams,$state,$location,$scope,MainService,$filter){
    var cc = this;



    function init(){
      MainService.getCompanies().then(function(companies){
        console.log(companies,'companies');
        cc.companies = companies.data;
      })
    }

    cc.seeCompany = function(id){
      console.log('alskdj');
      $location.path('view_company/'+id);
    }

    cc.goMain = function(){
      $location.path('main');
    }

    cc.hideEmpty = function(key){
      if(cc.companies[key]){
        console.log(cc.companies[key]);
      }
      return false;
    }

    cc.createTerm = function(){
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '../templates/new-term-tpl.html',
      controller: 'modalInstanceController',
      resolve: {
        items: function () {
          return $scope.term;
        }
      }
    });

    modalInstance.result.then(function (term) {
      console.log(term,'term');
    }, function () {
    });
    }

    init();
});
})();
