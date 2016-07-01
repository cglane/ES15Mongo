(function(){
  "use strict"
  angular
    .module('main')
    .factory('LoginService',function($http){

      var url = '';

      var doLogin = function(obj){
        return $http.post('/api/login/',obj);
      };

      var doLogOut = function(){
        return $http.post('/api/logout/',{withCredentials:true});
      };


    return{
      doLogin:doLogin,
      doLogOut:doLogOut
    };
  });
})();
