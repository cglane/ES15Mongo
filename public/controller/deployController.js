
(function(){
"use strict";

angular
  .module('main')
  .controller('DeployController',function(SocketService,$uibModalInstance,$uibModal,$stateParams,$state,$route,$location,$scope, $rootScope,MainService,$filter){
    $scope.awsDynamic = 0;
    $scope.localDynamic = 0;
    $scope.deployComplete = false;
    $scope.awsMax = $rootScope.customClients.length;
    $scope.localMax = $rootScope.customClients.length;

    SocketService.on('amazonFolder',function(el){
      ($scope.awsDynamic < $scope.awsMax)?$scope.awsDynamic++: null;
    });

    SocketService.on('localFolder',function(el){
      ($scope.localDynamic < $scope.localMax)?$scope.localDynamic++: null;
      $scope.$apply();
    })

    $scope.writeCustom = function(){
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
