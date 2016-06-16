var mongoose = require('mongoose');
var setting = require('../conf/setting.json');

module.exports = function(){
    mongoose.connect(setting['db_url']);

    mongoose.connection.on('error', function(err){
        console.log(err);
    });
    mongoose.connection.on('connected', function() {
        console.log('connect to mongodb success');
    });
}

