
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
         vm.groups = filterGroup(terms.data);
      })
      MainService.getNeedTranslation().then(function(terms){
        console.log(terms,'need Translation');
      })
    }

    vm.searchTerms = function(){
      console.log('laskdjsj');
      console.log(vm.searchParams);
      console.log(vm.groups,'groups');
      _.each(vm.groups,function(group){
        _.each(group,function(term){
          if(term.key == vm.searchParams){
            vm.searchResults = term.key;
            console.log(vm.searchResults,'searchResults');
          }
        })
      })
    }

    vm.clearSearch = function(){
      vm.searchParams = undefined;
      vm.searchResults = null;
    }

    init();
});
})();
