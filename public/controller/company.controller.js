
(function(){
"use strict";

angular
  .module('main')
  .controller('CompanyController',function(SocketService,$uibModal,$interval,$stateParams,$state,$location,$scope,MainService,$filter){
    var cc = this;
    cc.loadingText = "Loading may take a few seconds....";
    cc.isloading = {}
    cc.isReady = false;
    cc.init = function(){
      var promise = $interval(function () {
        cc.loadingText+= '.';
      }, 800);

      MainService.getAllClientIds().then(function(companyArr){
        MainService.getCompanyNames(companyArr).then(function(res){
          $interval.cancel(promise);
          if(res.data == 'noSessId')$location.path('login')
          else {
          cc.isReady = true;
          cc.companies = res.data;
          }
        })
      })
    };

    cc.seeCompany = function(id){
      console.log('alskdj');
      $location.path('view_company/'+id);
    };

    cc.goMain = function(){
      $location.path('main');
    };

    cc.hideEmpty = function(key){
      if(cc.companies[key]){
        console.log(cc.companies[key]);
      }
      return false;
    };

    cc.modalTerm = function(clientId,term){
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '../templates/modal-term-tpl.html',
      controller: 'modalInstanceController',
      resolve: {
        items: function () {
          return {
            clientId: clientId,
            term:term
          }
        }
      }
    });
    modalInstance.result.then(function (term) {
      $scope.term = term;
    }, function () {
    });
    }

    cc.folderUpload = function(){
      var items = 'hello'
      var modalInstance = $uibModal.open({
        templateUrl: '../templates/file-upload-tpl.html',
        controller: 'UploadController',
        resolve:{
          items:function(){
            return cc.companies;
          }
        }
      });

    modalInstance.result.then(function () {
      console.log('hello');
    }, function () {
    });
    }

    cc.deployCloud = function(companiesReady){
    if(cc.isReady){
    var modalInstance = $uibModal.open({
      templateUrl: '../templates/deploy-cloud-tpl.html',
      controller: 'DeployController',
      resolve: {
        items: function () {
          return cc.companies;
        }
      }
    });
    modalInstance.result.then(function (term) {
      console.log('closed');
    }, function () {
    });
  }
    }

    SocketService.on('connect', function () {
          console.log('socket connected');
     });

});
})();
