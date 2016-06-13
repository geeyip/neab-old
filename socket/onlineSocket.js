var socketIo = require('socket.io');

module.exports = function(server){

    var io = socketIo.listen(server);

    /**
     * 客户端连接监听
     */
    io.sockets.on('connection',function(socket){
        /**
         * 客户端登录监听
         */
        socket.on('sendMsg',function(data){

            console.log(data);
            socket.emit('receiveMsg','我去');
        });


        /**
         * 客户端断开连接监听
         */
        socket.on('disconnect', function(){
            console.log('disconnect');
        });

    });
}