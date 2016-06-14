var passport = require('passport');
var Account = require('../models/account');
var outAuth = require('../conf/outAuth.json');
/**
 * 登录认证配置
 * @param app
 */
module.exports = function(app){
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(Account.createStrategy());
    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());
    app.use(function(req, res, next) {
        //验证是否已经登录
        if (outAuth.indexOf(req.path) == -1) {
            if (!req.isAuthenticated || !req.isAuthenticated()) {
                if (req.session) {
                    req.session.returnTo = req.originalUrl || req.url;
                }
                return res.redirect('/login');
            }
        }
        next();
    });
}