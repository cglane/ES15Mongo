


(function(){
"use strict";

angular
  .module('main')
  .controller('CompanyTermController',function($uibModal,$stateParams,$location,$scope,MainService,$filter,$state){

    var ct = this;
        ct.key = $stateParams.key;
        ct.group = $stateParams.group;
        ct.clientId = $stateParams.clientId;

    function init(){
      MainService.getOneTerm(ct.key,ct.group).then(function(res){
        localStorage.setItem('termId',res.data._id)
        ct.term = res.data;
        ct.term.createdAt  = new Date(1 * ct.term.createdAt);
        ct.translations = res.data.translations.filter(function(el){
          return el.clientId == ct.clientId;
        });
        ct.noRepeatKeys = ['translations','__v','_id','softDelete','createdAt','updatedAt','createdBy'];
      })
    }

    ct.termKeys = function(key){
      if(_.contains(ct.noRepeatKeys,key)){
        return true;
      }else{
        return false;
      }
      // return (_.contains(ct.noRepeatKeys,key))? true: false;
    }

    ct.editTerm = function(key,val){
      ct.term[key] = val;
      ct.term.updatedAt = new Date();
      MainService.editOneTerm(ct.term).then(function(el){
      })
    }

    ct.editTranslation = function(key,val,trans){
      trans[key] = val;
      console.log(trans,'trans');
      MainService.editTranslation(trans).then(function(el){
      })
    }

    ct.softDelete = function(term){
          var r = confirm("Are you sure you want to delete this Term?");
          if (r == true) {
              MainService.deleteTerm(term._id).then(function(){
                //go To Main
                $state.go('view_companies',{'clientId':ct.clientId})
              })
          }else{
            ct.term.softDelete = false;
          }
       }

    ct.deleteTrans = function(trans){
      var r = confirm("Are you sure you want to delete this translation from clientId: "+trans.clientId+" ?");
      if (r == true) {
          MainService.deleteTrans(trans._id).then(function(){
            ct.term.translations = ct.term.translations.filter(function(el){
              return el._id != trans._id;
            })
          })
      }
    };


    init();

});
})();
