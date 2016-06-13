
(function(){
"use strict";

angular
  .module('main')
  .controller('LoginController',function($stateParams,$location,$scope,LoginService){

    $scope.login = function(){
      var obj = {
        password: $scope.password,
        username: $scope.username
      }
      LoginService.doLogin(obj).then(function(res){
        // console.log(res,'res');
        // if(res.data)$location.path("/companies")
      })
    };

    $scope.logOut = function(){
      console.log('alsdkjsd');
      $location.path('/login')
      LoginService.doLogOut().then(function(){
        console.log('You are logged Out');
      })
    };
});
})();
