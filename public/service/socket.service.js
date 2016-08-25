  SocketService.$inject = ['$rootScope',"socket"]
  export default function SocketService($rootScope){
    var Socket = {};
    var liveSocket = io("");
    liveSocket.heartbeatTimeout = 200000;
      Socket.on =  function(event, cb){
        liveSocket.on(event, function(data){
          cb(data);
          $rootScope.$apply();
        });
      };
      Socket.emit = function(event, data){
        liveSocket.emit(event, data);
        // $rootScope.$apply();
      }
    return Socket;
  }
