var mongoose = require('mongoose');
var setting = require('../conf/setting.json');

module.exports = function(){

    var opts = {
        db: { native_parser: true },
        server: {
            poolSize: 5 ,
            auto_reconnect: true,
            socketOptions: {keepAlive: 1}
        }
    }
    var con = mongoose.connect(setting['db_url'], opts);
    
    mongoose.connection.on('error', function(err){
        console.log(err);
    });
    mongoose.connection.on('connected', function() {
        console.log('connect to mongodb success');
    });
}

