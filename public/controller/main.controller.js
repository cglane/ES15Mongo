
(function(){
"use strict";

angular
  .module('main')
  .controller('MainController',function($stateParams,$location,$scope,MainService,$filter){
    var vm = this;
    vm.groups = {};
    vm.showSearch = false;
    var allTerms = [];
    function filterGroup(array){
      return _.groupBy(array,"group")
    }

    vm.init = function(){
      MainService.getAllTerms().then(function(terms){
         vm.groups = filterGroup(terms.data);
         allTerms = terms;
      })
    }

    vm.searchTerms = function(){
      vm.searchParams = vm.searchParams;
      vm.searchResults = $filter('filter')(allTerms.data,{key:vm.searchParams});
      vm.searchError = (!vm.searchResults || vm.searchResults.length <1)? true : false;
    }

    vm.clearSearch = function(){
      vm.searchParams = undefined;
      vm.searchResults = null;
      vm.showSearch = false;
    }

});
})();
