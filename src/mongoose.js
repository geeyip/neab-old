var mongoose = require('mongoose');
var setting = require('../conf/setting.json');
/**
 * 数据库设置
 */
module.exports = function(){
    mongoose.connect(setting.db_url);
    mongoose.connection.on('error', function(err){
        console.log(err);
    });
    mongoose.connection.once('open', function (callback) {
        console.log('connect to mongodb success');
    });
}