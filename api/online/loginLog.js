var http = require('http');
var mongoose = require('mongoose');
var Entry = mongoose.model('Entry');
var loginUrl = '/api/system/log/in?token=pubservice';
var logoutUrl = '/api/system/log/out?token=pubservice';

/**
 * 记录登入日志
 * @param userInfo
 */
exports.login = function (userInfo) {
    //httpRequest(userInfo, loginUrl);
    login2DB(userInfo);
}

/**
 * 记录登出日志
 * @param socket
 */
exports.logout = function (socket) {
   // httpRequest(socket, logoutUrl);
    logout2DB(socket);
}

/**
 * 发起http请求
 * @param obj
 * @param url
 */
function httpRequest(obj, url){
    var user = {
        userName: obj.userId,
        ipAddress: obj.ip
    }
    var content = JSON.stringify(user);
    var options = {
        method: 'POST',
        hostname: obj.serverIp,
        port: obj.serverPort,
        path: url,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    };
    var req = http.request(options, function (res) {
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.write(content);
    req.end();
}

function login2DB(obj) {

    var log = {
        userId: obj.userId,
        userName: obj.userName,
        userUnit: obj.userUnit,
        ip: obj.ip,
        logTime: new Date(),
        offTime: ''
    };

    logout2DB(obj);
    var entry = new Entry(log);
    entry.save();
}

function logout2DB(obj) {
    Entry.update({
        userId: obj.userId,
        ip: obj.ip,
        offTime: ''
    },{$set: {offTime: new Date()}}, { multi: true }, function (err) {
        if(err) console.log(err);
    });
}