
(function(){
"use strict";

angular
  .module('main')
  .controller('CompanyController',function($stateParams,$state,$location,$scope,MainService,$filter){
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

    init();
});
})();
