
(function(){
"use strict";

angular
  .module('main')
  .controller('UploadController',function(Upload,$uibModalInstance,$uibModal,$stateParams,$state,$route,$location,$window,$scope,MainService,$filter){
    $scope.uploadObj = {};
    $scope.companyIds = MainService.getCompanyIds();
    MainService.getAllClientIds().then(function(arr){
      $scope.companyIds = arr.data;
      console.log(arr.data,'arr');
    })
    $scope.languages = []

    $scope.showContent = function($fileContent){
        try{
          $scope.uploadObj.jsonData = JSON.parse($fileContent);
        }catch(e){
          alert('Invalid file structure');
        }
    };

    $scope.addToDB = function(myForm){
      $scope.uploadObj.clientId = $scope.uploadObj.clientId.split(',')[0];
      if(!myForm.$error.required){
        $scope.uploadObj.keys = Object.keys($scope.uploadObj.jsonData)
        MainService.uploadFile($scope.uploadObj).then(function(el){
          $scope.logResults = el.data.comments;
        })
      }
    };

    $scope.ok = function () {
      $uibModalInstance.close();
    };

});
})();
