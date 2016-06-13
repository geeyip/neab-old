function socketTest(){
    var socket = io.connect();
    socket.emit('sendMsg', '我是天才');
    socket.on('receiveMsg', function(data){
       console.log(data);
    });
}