


(function(){
"use strict";

angular
  .module('main')
  .controller('TermController',function($stateParams,$location,$scope,MainService,$filter){
    var tc = this,
        key = $stateParams.key,
        group = $stateParams.group;
        console.log($stateParams.key);

    function init(){
      MainService.getOneTerm(key,group).then(function(res){
        console.log(res,'res');
        localStorage.setItem('termId',res.data._id)
        tc.term = res.data;
        tc.term.createdAt  = new Date(1 * tc.term.createdAt);
        // tc.term.updatedAt  = new Date(1 * tc.term.updatedAt);
        tc.translations = res.data.translations;
      })
    }

    tc.editTerm = function(key,val){
      tc.term[key] = val;
      tc.term.updatedAt = new Date();
      MainService.editOneTerm(tc.term).then(function(el){
        console.log(el,'great success');
      })
    }

    tc.editTranslation = function(key,val,trans){
      trans[key] = val;
      MainService.editTranslation(trans).then(function(el){
        console.log(el.data[0],'great Success');
      })
    }


    init();
});
})();
