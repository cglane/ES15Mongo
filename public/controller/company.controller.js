
(function(){
"use strict";

angular
  .module('main')
  .controller('CompanyController',function(SocketService,$uibModal,$stateParams,$state,$location,$scope,MainService,$filter){
    var cc = this;
    SocketService.on('progress',function(el){
      console.log(el,'el');
    })
    function init(){
      cc.companies = [];
      MainService.getCompanies().then(function(companies){
        MainService.getCompanyIds().then(function(companyIds){
          _.each(companyIds.data,function(companyObj){
            _.each(companies.data,function(id){
              if(id === companyObj.id){
                cc.companies.push(companyObj);
              }
            })
          })
        })
      })
      console.log(cc.companies,'companies');
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

    cc.deployCloud = function(){
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

    init();
});
})();
