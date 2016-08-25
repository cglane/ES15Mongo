LoginService.$inject = ['$http'];
export default function LoginService($http){
  var Login = {};
  var url = '';

  Login.doLogin = function(obj){
    return $http.post('/api/login/',obj);
  };

Login.doLogOut = function(){
    return $http.post('/api/logout/',{withCredentials:true});
  };
  return Login;
}
