(function(){
  "use strict"
  angular
    .module('main')
    .factory('SocketService',function($rootScope){
      var socket = io("http://localhost:3000/");

      // socket.on("greetings", function(data){
      //   console.log("FROM THE SOCKET", data);
      // })

      return {
        on: function(event, cb){
          socket.on(event, function(data){
            cb(data);
            $rootScope.$apply();
          });
        },
        emit: function(event, data){
          socket.emit(event, data);
          // $rootScope.$apply();
        }
      }
  });
})();
