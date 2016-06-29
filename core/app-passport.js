var passport = require('passport');
var Account = require('../api/model/account');
var Resource = require('../conf/resource.json');
var ACL = require('./app-acl');

/**
 * 登录认证配置
 * @param app
 */
module.exports = function(app){

    //passport配置
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(Account.createStrategy());
    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());

    //验证是否已经登录
    app.use(function(req, res, next) {

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
        var path = req.path;
        var pathArray = path.split('/');
        var standardPath = pathArray.slice(0,3).join('/');
        var resource = pathArray.slice(1,2).join('/');
        var permission = pathArray.slice(2,3).join('/');
        permission = permission==''?resource:permission;

        if (Resource["not_need_auth"].indexOf(path) == -1
            && Resource["not_need_grant"].indexOf(standardPath) == -1
            && resource != '') {
            console.log(req.user.username);
            var userId = req.user.username;
            ACL.isAllowed(userId, resource, permission, function(err, allowed){
                console.log('[路径]:'+path+' [方法]:'+req.method+' [资源]:'+resource+' [操作]:' + permission+' [权限]:'+allowed);
                allowed = true;
                if(allowed){
                    next();
                }else{
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