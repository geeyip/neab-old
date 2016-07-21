var _ = require('underscore');

/**
 * 连接操作对象
 * @type {{}}
 */
var socketStore = {};

/**
 * 连接存储信息
 * @type {{}}
 */
socketStore.sockets = {};

/**
 * 新增连接
 * @param socket
 */
socketStore.addSocket = function(socket){
    this.sockets[socket.id] = socket;
}

/**
 * 移除连接
 * @param sid
 */
socketStore.removeSocket = function(sid) {
    delete this.sockets[sid];
}

/**
 * 通过socketId查找连接
 * @param sid
 * @returns {*}
 */
socketStore.findSocketBySid = function(sid) {
    return this.sockets[sid];
}

/**
 * 取得所有连接集合
 * @returns {*}
 */
socketStore.getSockets = function() {
    return _.values(this.sockets);
}

/**
 * 通过用户ID与IP查找连接
 * @param userId
 * @param ip
 * @returns {*}
 */
socketStore.findSocketByUserIdAndIp = function(userId, ip){
    var result = _.filter(this.getSockets(), function(_user){
        return _user.ip == ip && _user.userId == userId;
    });
    return result;
}

/**
 * 判断用户是否保持连接
 * @param userId
 * @param ip
 * @returns {boolean}
 */
socketStore.hasSocket = function(userId, ip){
    var query = _.find(this.getSockets(), function(_user){
        return _user.ip == ip && _user.userId == userId;
    });
    if(query){
        return true;
    }
    return false;
}

module.exports = socketStore;