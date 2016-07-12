
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
      vm.searchResults = allTerms.data.filter(function(el){
        if(el.key.indexOf(vm.searchParams) > -1) return true;
        for (var i = 0; i < el.translations.length; i++) {
            if(el.translations[i].val.toLowerCase().indexOf(vm.searchParams) != -1) return true;
        }
      })
        vm.searchError = (!vm.searchResults || vm.searchResults.length <1)? true : false;
    }


    vm.clearSearch = function(){
      vm.searchParams = undefined;
      vm.searchResults = null;
      vm.showSearch = false;
    }

});
})();
