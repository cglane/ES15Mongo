
(function(){
"use strict";

angular
  .module('main')
  .controller('DeployController',function(SocketService,$uibModalInstance,$uibModal,$stateParams,$state,$route,$location,$scope,MainService,$filter){

    $scope.writeAll = function(){
      console.log('writeAll');

    }
    SocketService.on('progress',function(el){
      console.log(el,'el');
    })

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
