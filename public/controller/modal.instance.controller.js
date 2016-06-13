
(function(){
"use strict";

angular
  .module('main')
  .controller('modalInstanceController',function($uibModalInstance,$uibModal,$stateParams,$state,$location,$scope,MainService,$filter){

    function init(){
      $scope.translations = [new Date()];
      $scope.term = {};
      $scope.term.translations = [];
      $scope.companyIds = MainService.getCompanyIds();
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
        lang:trans.lang[0],
        val:trans.value,
        clientId:trans.optionClientId[0],
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
            createTerm($scope.term,function(termId){
                for (var i = 0; i < $scope.term.translations.length; i++) {
                  addTranslation($scope.term.translations[i],termId)
                }
      })
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
