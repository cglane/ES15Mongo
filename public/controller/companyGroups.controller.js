
(function(){
"use strict";

angular
  .module('main')
  .controller('CompanyGroupsController',function($stateParams,$location,$scope,MainService,$filter){
    var cg = this;
    cg.clientId = $stateParams.clientId;

    function init(){
      MainService.getCompanyTerms(cg.clientId).then(function(terms){
        cg.groups = terms.data;
        console.log(terms.data,'terms');
        // cg.groups = filterGroup(terms.data);
        // console.log(cg.groups);
      })
    }

    cg.downloadLocally = function(){
      
    }

    init();
});
})();
