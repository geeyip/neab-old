var http = require('http');
var loginUrl = '/api/system/log/in';
var logoutUrl = '/api/system/log/out';

/**
 * 记录登入日志
 * @param userInfo
 */
exports.login = function (userInfo) {
    httpRequest(userInfo, loginUrl);
}

/**
 * 记录登出日志
 * @param socket
 */
exports.logout = function (socket) {
    httpRequest(socket, logoutUrl);
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