
  LoginController.$inject['$stateParams','$location','$scope','LoginService']
  export default function LoginController($stateParams,$location,$scope,LoginService){

    $scope.login = function(){
      var obj = {
        password: $scope.password,
        username: $scope.username
      }
      LoginService.doLogin(obj).then(function(res){
        if(res.data.success){
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

}
