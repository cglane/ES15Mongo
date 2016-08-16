
CompanyController.$inject = ['SocketService','$uibModal','$interval','$stateParams','$state','$location','$scope','$rootScope','MainService','$filter'];
export default function CompanyController(SocketService,$uibModal,$interval,$stateParams,$state,$location,$scope,$rootScope,MainService,$filter) {

    var cc = this;
    cc.loadingText = "Loading may take a few seconds....";
    cc.isloading = {}
    cc.isReady = false;
    cc.runningLocally = (document.location.hostname == 'localhost');
    cc.init = function(){
      var promise = $interval(function () {
        cc.loadingText+= '.';
      }, 800);

      MainService.getAllClientIds().then(function(companyArr){
        $rootScope.clients = companyArr.data;
        MainService.getCompanyNames(companyArr).then(function(res){
          $rootScope.customClients = res.data;
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
      $location.path('view_company/'+id);
    };

    cc.goMain = function(){
      $location.path('main');
    };

    cc.hideEmpty = function(key){
      if(cc.companies[key]){
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
    }, function () {
    });
  }
    }

    SocketService.on('connect', function () {
          console.log('socket connected');
     });

}
