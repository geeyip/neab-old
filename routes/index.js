var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var passport = require('passport');
var sureLogin = require('connect-ensure-login');

router.get('/', sureLogin.ensureLoggedIn(), function(req, res, next) {
    Account.find(function(err, users){
        res.render('index', { title: '用户列表', users: users});
    });

});

router.get('/login', function(req, res){
    res.render('login', {title:'登录', username : req.flash('username') });
})

router.post('/login', function(req, res, next) {
    passport.authenticate('local',function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error','用户名与密码不匹配');
            req.flash('username', req.body.username);
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            //req.flash('success','欢迎回来');
            return res.redirect(req.session.returnTo);
        });
    })(req, res, next);
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/profile', sureLogin.ensureLoggedIn(), function(req, res){
  res.render('profile', {title: '个人信息'});
});

router.get('/register', function(req, res){
    res.render('register', {title: '注册'});
});
router.post('/register', function(req, res){
    Account.register(new Account({ username : req.body.username,email: req.body.email }), req.body.password, function(err, account) {
        if (err) {
            console.log(err);
            return res.render('register', { account : account ,error : [err.message] });
        }
        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
 });

module.exports = router;
