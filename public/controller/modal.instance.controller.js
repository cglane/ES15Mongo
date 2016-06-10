
(function(){
"use strict";

angular
  .module('main')
  .controller('modalInstanceController',function($uibModalInstance,$uibModal,$stateParams,$state,$location,$scope,MainService,$filter){

    function init(){
      $scope.translations = [new Date()];
      $scope.term = {};
      $scope.term.translations = [];
    }

    function createTerm(term,callback){
      var rtnObj = {
        group: term.group,
        key:term.key,
        createdBy:term.createdBy,
        comments:term.comments,
        softDelete:false
      };
      MainService.createTerm(rtnObj).then(function(response){
        if(response.data.success == true){
          console.log(response.data,'response');
          console.log(response.data.data['_id'],'id');
          callback(response.data.data._id);
          //addTranslation
        }else{
          alert(response.data.message)
          console.log(response);
        };
      });
    }

    function addTranslation(trans,termId){
      var obj = {
        termId:termId,
        lang:trans.lang[0],
        val:trans.value
      };
      // Not going to work need to change
      if(trans.otherClientId)obj.clientId = trans.otherClientId;
      else if(trans.optionClientId[0]) trans.optionClientId[0];

      MainService.createTranslation(obj).then(function(el){
        if(el.data.success == true){
          console.log(el,'el');
          console.log('translation added');
          //callback
        }else{
          console.log(el);
          console.log('translation already exists');
          //error translation exists break some shiiisisisis
        }
      });
    }

    $scope.ok = function (form) {
      if(!form.$error.required){
            createTerm($scope.term,function(termId){
              console.log(termId,'termId');
        for (var i = 0; i < $scope.term.translations.length; i++) {
          addTranslation($scope.term.translations[i],termId)
          }
      })
      // $uibModalInstance.close($scope.term);
    }else{
      console.log('Missing something');
    }
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.addTranslation = function(){
      $scope.translations.push(new Date());
    };

    init();


});
})();
