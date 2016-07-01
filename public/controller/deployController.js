
(function(){
"use strict";

angular
  .module('main')
  .controller('DeployController',function(SocketService,$uibModalInstance,$uibModal,$stateParams,$state,$route,$location,$scope, $rootScope,MainService,$filter){
    $scope.awsDynamic = 0;
    $scope.localDynamic = 0;
    $scope.deployComplete = false;

    SocketService.on('amazonFolder',function(el){
      console.log(el,'amazonFolder');
      $scope.awsDynamic++;
    });

    SocketService.on('localFolder',function(el){
      console.log(el,'el');
      $scope.localDynamic++;
    })

    $scope.writeAll = function(){
      $scope.awsMax = $rootScope.clients.length-1;
      $scope.localMax = $rootScope.clients.length-1;
      MainService.writeAllSocket().then(function(el){
        console.log(el);
        if(el.data.success)$scope.deployComplete = true;
      })
    };

    $scope.writeCustom = function(){
      $scope.awsMax = $rootScope.customClients.length-1;
      $scope.localMax = $rootScope.customClients.length-1;
      MainService.writeCustom().then(function(el){
        console.log(el);
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
