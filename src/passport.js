var passport = require('passport');
var Account = require('../models/account');
var Resource = require('../conf/resource.json');
var ACL = require('./acl');
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
        if (Resource["not_need_auth"].indexOf(req.path) == -1) {
            if (!req.isAuthenticated || !req.isAuthenticated()) {
                if (req.session) {
                    req.session.returnTo = req.originalUrl || req.url;
                }
                return res.redirect('/login');
            }
        }
        next();
    });

    //验证当前用户对资源是否有访问权限

    app.use(function(req, res, next) {
        var resource = req.path.split('/').slice(1,2).join('/');
        var permission = req.path.split('/').slice(2,3).join('/');
        permission = permission==''?resource:permission;
        if (Resource["not_need_auth"].indexOf(req.path) == -1 && Resource["not_need_grant"].indexOf(req.path) == -1 && resource != '') {
            var userId = req.user.username;
            console.log('资源是：'+resource);
            console.log('权限是：'+permission);
            ACL.isAllowed(userId, resource, permission, function(err, allowed){
                console.log(allowed);
                if(allowed){
                    next();
                }else{
                    //next();
                   res.render('error', {
                        message: 'ACL 禁止访问资源',
                        error: {status: '401.3'}
                   });
                }
            });
        }else{
            next();
        }
    });
}