var session = require('express-session');
var setting = require('../conf/setting.json');
/**
 * session设置
 * @param app
 */
module.exports = function(app){
    app.use(session({
        secret: setting.session_secret,
        // cookie: {maxAge: 1000*60*30 },
        // rolling: true,
        resave: false,
        saveUninitialized: false
    }));
}