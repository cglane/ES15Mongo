
(function(){
"use strict";

angular
  .module('main')
  .controller('DeployController',function(SocketService,$uibModalInstance,$uibModal,$stateParams,$state,$route,$location,$scope, $rootScope,MainService,$filter){
    $scope.awsDynamic = 0;
    $scope.localDynamic = 0;
    $scope.deployComplete = false;

    SocketService.on('amazonFolder',function(el){
      ($scope.awsDynamic < $scope.awsMax)?$scope.awsDynamic++: null;
    });

    SocketService.on('localFolder',function(el){
      ($scope.localDynamic < $scope.localMax)?$scope.localDynamic++: null;
    })
    $scope.writeAll = function(){
      $scope.awsMax = $rootScope.clients.length;
      $scope.localMax = $rootScope.clients.length;
      MainService.writeAllSocket().then(function(el){
        if(el.data.success)$scope.deployComplete = true;
      })
    };

    $scope.writeCustom = function(){
      $scope.awsMax = $rootScope.customClients.length;
      $scope.localMax = $rootScope.customClients.length;
      MainService.writeCustom().then(function(el){
        if(el.data.success)$scope.deployComplete = true;
      })
    }

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
