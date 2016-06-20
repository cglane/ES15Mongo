
(function(){
"use strict";

angular
  .module('main')
  .controller('DeployController',function(SocketService,$uibModalInstance,$uibModal,$stateParams,$state,$route,$location,$scope,MainService,$filter){
    $scope.awsMax = 0;
    $scope.awsDynamic = 0;
    $scope.localMax = 0;
    $scope.localDynamic = 0;
    $scope.deployComplete = false;

    SocketService.on('amazonFolder',function(el){
      $scope.awsMax = el.total;
      $scope.awsDynamic = el.itr;
    });

    SocketService.on('localFolder',function(el){
      $scope.localMax = el.total;
      $scope.localDynamic = el.itr;
    })

    $scope.writeAll = function(){
      MainService.writeAllSocket().then(function(el){
        if(el.data.success)$scope.deployComplete = true;
        console.log(el);
      })
    };

    $scope.ok = function (form) {
      $uibModalInstance.close($scope.term);

    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.addTranslation = function(){
      $scope.translations.push(new Date());
    };


});
})();
