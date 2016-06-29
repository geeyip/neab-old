var _ = require('underscore');

/**
 * 在线用户操作对象
 * @type {{}}
 */
var userStore = {};

/**
 * 在线用户
 * @type {Array}
 */
userStore.users = [];

/**
 * 取得在线用户
 * @returns {Array}
 */
userStore.getUsers = function(){
    return this.users;
}

/**
 * 设置在线用户
 * @param _users
 */
userStore.setUsers = function(_users){
    this.users = _users;
}

/**
 * 取得在线用户数量
 * @returns {Number}
 */
userStore.getOnlineUserCount = function(){
    return this.users.length;
}

/**
 * 用户加入在线列表
 * @param userId
 * @param ip
 */
userStore.addUser = function(user){
    //delete user['serverIp'];
    //delete user['serverPort'];
    this.users.push(user);
}

/**
 * 寻找在线用户
 * @param userId
 * @param ip
 * @returns {*}
 */
userStore.findUser = function(userId, ip){
    var user = _.find(this.users, function(_user){
        return _user.userId == userId && _user.ip == ip;
    });
    return user;
}

/**
 * 用户从在线列表中移除
 * @param userId
 * @param ip
 */
userStore.removeUser = function(userId, ip){
    var user = this.findUser(userId, ip);
    var _users = _.without(this.users, user);
    this.setUsers(_users);
}

module.exports = userStore;