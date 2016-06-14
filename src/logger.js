var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var FileStreamRotator = require('file-stream-rotator');
/**
 * 日志设置
 * @param app
 */
module.exports = function(app){
    var logDirectory = path.join(__dirname,'../','log');
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
    var accessLogStream = FileStreamRotator.getStream({
        date_format: 'YYYYMMDD',
        filename: path.join(logDirectory, 'access-%DATE%.log'),
        frequency: 'daily',
        verbose: false
    });
    logger.token('username', function(req){
        return req.user?req.user.username:'';
    });
    app.use(logger(':date :remote-addr :username :method :url :status :response-time',{
        skip: function(req, res){
            return req.user == undefined;
        }
    }));
}
