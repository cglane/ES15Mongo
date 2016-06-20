
(function(){
"use strict";

angular
  .module('main')
  .controller('DeployController',function(SocketService,$uibModalInstance,$uibModal,$stateParams,$state,$route,$location,$scope,MainService,$filter){
    $scope.max = 0;
    $scope.dynamic = 0;
    $scope.deployComplete = false;

    SocketService.on('progress',function(el){
      $scope.max = el.total;
      $scope.dynamic = el.itr;
    });

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
