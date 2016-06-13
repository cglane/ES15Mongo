
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

    cc.modalTerm = function(clientId,term){
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '../templates/modal-term-tpl.html',
      controller: 'modalInstanceController',
      resolve: {
        items: function () {
          return {
            clientId: clientId,
            term:term
          }
        }
      }
    });

    modalInstance.result.then(function (term) {
      $scope.term = term;
    }, function () {
    });
    }

    init();
});
})();
