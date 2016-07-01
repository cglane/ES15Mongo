(function(){
  "use strict"
  angular
    .module('main')
    .factory('LoginService',function($http){
<<<<<<< HEAD
=======
      var url = '';
>>>>>>> 5d7bfeb947a8e2005100f89ca43f7f7ecd677f0b

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
