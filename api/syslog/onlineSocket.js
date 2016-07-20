var socketIo = require('socket.io');
var _ = require('underscore');
var userStore = require('./userStore');
var socketStore = require('./socketStore');
var loginLog = require('./loginLog');

module.exports = function(server){

    var io = socketIo.listen(server);

    /**
     * 客户端连接监听
     */
    io.sockets.on('connection',function(socket){
        /**
         * 客户端登录监听
         */
        socket.on('login',function(userInfo){
            //用户标识(用户名)
            var userId = userInfo.userId;
            //连接ID
            var sid = socket.id;
            //客户端IP
            var ip = socket.handshake.address;

            if(userId){

                //用户信息附加到socket上
                socket['ip'] = ip;
                socket['userId'] = userId;
                socket['serverIp'] = userInfo.serverIp;
                socket['serverPort'] = userInfo.serverPort;

                //保存socket
                socketStore.addSocket(socket);
                //判断用户是否已经登录
                var result = userStore.findUser(userId, ip);
                //是新登录用户
                if(!result){
                    userInfo['ip'] = ip;
                    //保存登录用户
                    userStore.addUser(userInfo);
                    //记录登录日志
                    loginLog.login(userInfo);
                    console.log('记录【登入】日志：'+userId);
                }
            }

        });

        /**
         * 客户端点击注销
         */
        socket.on('logout',function(userId){
            //客户端IP
            var ip = socket.handshake.address;
            //通过userId和ip查找所有连接
            var allSocket = socketStore.findSocketByUserIdAndIp(userId, ip);
            //通知所有连接断开
            allSocket.forEach(function(so){
                so.emit('logoutAll');
            });
            console.log('注销:'+userId);
        });

        /**
         * 客户端断开连接监听
         */
        socket.on('disconnect', function(){
            var sid = socket.id;
            //查找当前连接
            var currentSocket = socketStore.findSocketBySid(sid);
            if(currentSocket){
                //当前连接对应的用户ID
                var _userId = currentSocket.userId;
                //当前连接对应的客户端IP
                var _ip = currentSocket.ip;
                //移除连接
                socketStore.removeSocket(sid);

                //一个3秒的延迟，用于判断用户是否在刷新页面
               setTimeout(function(){
                    //通过userId和ip检查当前用户是否还有保持的连接
                    var isLogin = socketStore.hasSocket(_userId, _ip);
                    //用户是否在线
                    var user = userStore.findUser(_userId, _ip);
                   //没有保持的连接且用户还在线，就记录登出时间
                    if(!isLogin && user){
                        userStore.removeUser(_userId, _ip);
                        loginLog.logout(currentSocket);
                        console.log('记录【登出】日志：'+_userId);
                    }
                },3000);
            }
        });
    });
}