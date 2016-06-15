


(function(){
"use strict";

angular
  .module('main')
  .controller('TermController',function($stateParams,$location,$scope,MainService,$filter,$state){

    var tc = this,
        key = $stateParams.key,
        group = $stateParams.group;

    function init(){
      MainService.getOneTerm(key,group).then(function(res){
        localStorage.setItem('termId',res.data._id);
        tc.term = res.data;
        tc.term.createdAt  = new Date(1 * tc.term.createdAt);
        tc.translations = res.data.translations;
        tc.noRepeatKeys = ['translations','__v','_id','updatedBy','softDelete','createdAt','updatedAt','createdBy'];
      })
    }

    tc.termKeys = function(key){
      if(_.contains(tc.noRepeatKeys,key)){
        return true;
      }else{
        return false;
      }
      // return (_.contains(tc.noRepeatKeys,key))? true: false;
    }

    tc.editTerm = function(key,val){
      tc.term[key] = val;
      MainService.editOneTerm(tc.term).then(function(el){
      })
    }

    tc.editTranslation = function(key,val,trans){
      trans[key] = val;
      MainService.editTranslation(trans).then(function(el){
      })
    }

    tc.softDelete = function(term){
          var r = confirm("Are you sure you want to delete this Term?");
          if (r == true) {
              MainService.deleteTerm(term._id).then(function(){
                //go To Main
                $state.go('main')
              })
          }else{
            tc.term.softDelete = false;
          }
       }

    tc.deleteTrans = function(trans){
      var r = confirm("Are you sure you want to delete this translation from clientId: "+trans.clientId+" ?");
      if (r == true) {
          MainService.deleteTrans(trans._id).then(function(){
            tc.term.translations = tc.term.translations.filter(function(el){
              return el._id != trans._id;
            })
          })
      }
    }

    init();

});
})();
