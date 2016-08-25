
  modalInstanceController.$inject = ['items','$uibModalInstance','$uibModal','$stateParams','$state','$route','$location','$scope','MainService','$filter']
   export default function modalInstanceController(items,$uibModalInstance,$uibModal,$stateParams,$state,$route,$location,$scope,MainService,$filter){

    function init(){
      $scope.translations = [new Date()];
      $scope.term = (items.term)?items.term:false;
      $scope.addedTranslations = [];
      $scope.addedTerm = {};
      $scope.clientId = items.clientId;
      MainService.getAllClientIds().then(function(arr){
        $scope.companyIds = arr.data;
        if($scope.clientId){
          var indx = arr.data.map(function(e) {return e.id; }).indexOf(parseInt($scope.clientId));
          $scope.clientDataStr = arr.data[indx].name + ','+ arr.data[indx].id;
        }
      })

    };

    function createTerm(term,callback){
      var rtnObj = {
        group: term.group,
        key:term.key,
        createdBy:term.createdBy,
        comments:term.comments,
        softDelete:false
      }
      MainService.createTerm(rtnObj).then(function(response){
        if(response.data.success == true){
          callback(response.data.data._id);
        }else{
          alert(response.data.message)
        }
      })
    };

    function addTranslation(trans,termId){
      var obj = {
        termId:termId,
        lang:trans.lang,
        val:trans.value,
        clientId:($scope.clientId)?$scope.clientId: trans.optionClientId,
      };
      MainService.createTranslation(obj).then(function(el){
        if(el.data.success == true){
          console.log('translation added');
        }else{
          alert('translation already exists');
        }
      });
    }

    $scope.ok = function (form) {
      if(!form.$error.required){
        if(!$scope.term){
          createTerm($scope.addedTerm,function(termId){
              for (var i = 0; i < $scope.addedTranslations.length; i++) {
                $scope.addedTranslations[i].optionClientId = $scope.clientId;
                addTranslation($scope.addedTranslations[i],termId);
              }
            });
        }else{
          for (var i = 0; i < $scope.addedTranslations.length; i++) {
            if($scope.clientId){
              $scope.addedTranslations[i].clientId = $scope.clientId;
            }else{
              $scope.addedTranslations[i].optionClientId = $scope.addedTranslations[i].optionClientId.split(',')[1];
            }
            addTranslation($scope.addedTranslations[i],$scope.term._id);
          }
        }
        ($scope.term)?$state.reload():null;
      $uibModalInstance.close($scope.term);
    }else{
      console.log('Missing something');
    }
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.addTranslation = function(){
      $scope.translations.push(new Date());
    };

    init();


}
