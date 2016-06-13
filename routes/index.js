var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var passport = require('passport');
router.get('/', function(req, res, next) {
   res.redirect('users');
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
            var returnTo = req.session.returnTo;
            if(returnTo == undefined) returnTo = '/';
            return res.redirect(returnTo);
        });
    })(req, res, next);
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/profile', function(req, res){
  res.render('profile', {title: '个人信息'});
});

router.get('/register', function(req, res){
    res.render('register', {title: '注册'});
});

router.get('/register/user/exits', function(req, res){
    Account.findOne({username:req.query.username}, function(err, user){
        if(err){
            console.log(err);
        }
        if(user){
            res.writeHead(404);
            res.end();
        }else{
            res.writeHead(200);
            res.end();
        }
    });
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
