
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
        if(res.data.success){
          console.log(res.data.userName);
          localStorage.setItem('userName',res.data.userName)
          $location.path("/companies");
        }
        else alert('Incorrect Login Information');
      })
    };

    $scope.logOut = function(){
      LoginService.doLogOut().then(function(){
        $location.path('/login')
        console.log('You are logged Out');
      })
    };

});
})();
