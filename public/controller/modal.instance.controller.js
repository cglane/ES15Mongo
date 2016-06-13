
(function(){
"use strict";

angular
  .module('main')
  .controller('modalInstanceController',function(items,$uibModalInstance,$uibModal,$stateParams,$state,$route,$location,$scope,MainService,$filter){

    function init(){
      $scope.translations = [new Date()];
      $scope.term = (items.term)?items.term:false;
      $scope.addedTranslations = [];
      $scope.addedTerm = {};
      $scope.clientId = items.clientId;
      $scope.companyIds = MainService.getCompanyIds();
      $scope.otherOption = '';
      // MainService.getCompanyIds().then(function(companyObj){
      //   $scope.companies = companies;
      // })
    };

    function createTerm(term,callback){
      var rtnObj = {
        group: term.group,
        key:term.key,
        createdBy:term.createdBy,
        comments:term.comments,
        softDelete:false
      }
      MainService.createTerm(rtnObj).then(function(response){
        if(response.data.success == true){
          callback(response.data.data._id);
        }else{
          alert(response.data.message)
        }
      })
    };

    function addTranslation(trans,termId){
      var obj = {
        termId:termId,
        lang:trans.lang,
        val:trans.value,
        clientId:($scope.clientId)?$scope.clientId: trans.optionClientId,
      };
      MainService.createTranslation(obj).then(function(el){
        if(el.data.success == true){
          console.log('translation added');
        }else{
          alert('translation already exists');
        }
      });
    }

    $scope.ok = function (form) {
      if(!form.$error.required){
        if(!$scope.term){
          createTerm($scope.addedTerm,function(termId){
              for (var i = 0; i < $scope.addedTranslations.length; i++) {
                addTranslation($scope.addedTranslations[i],termId);
              }
            });
        }else{
          for (var i = 0; i < $scope.addedTranslations.length; i++) {
            addTranslation($scope.addedTranslations[i],$scope.term._id)
          }
        }
        ($scope.term)?$state.reload():null;
      $uibModalInstance.close($scope.term);
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
