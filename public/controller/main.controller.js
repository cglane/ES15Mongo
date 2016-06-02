
(function(){
"use strict";

angular
  .module('main')
  .controller('MainController',function($stateParams,$location,$scope,MainService,$filter){
    var vm = this;
    vm.groups = {};
    
    function filterGroup(array){
      return _.groupBy(array,"group")
    }

    function init(){
      MainService.getAllTerms().then(function(terms){
        //  vm.terms = terms;
        //  console.log('got all terms');
         vm.groups = filterGroup(terms.data);
      })
      MainService.getNeedTranslation().then(function(terms){
        console.log(terms,'need Translation');
      })
    }

    vm.searchTerms = function(){
      _.each(vm.terms.data,function(term){
        if(term.key == vm.searchParams){
          vm.searchResults = term.key;
        }
      })
    }

    vm.clearSearch = function(){
      vm.searchParams = undefined;
      vm.searchResults = null;
    }

    init();
});
})();
