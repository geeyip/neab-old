var express = require('express');
var db = require('./../database/db.js');
var router = express.Router();
var User = require('./../database/model/User').User;
var Account = require('../models/account');
var passport = require('passport');
var sureLogin = require('connect-ensure-login');
router.get('/',sureLogin.ensureLoggedIn(), function(req, res, next) {
    User.find(function(err,users){
        if(err){
            console.log(err);
        }
        console.log(users);
        res.render('index', { title: '首页',users: users });
    });
});

router.route('/login')
.get(function(req, res){
        res.render('login', { user : req.user });

       // res.render('login', {title: '登录', username: req.flash('username')});
})
.post(passport.authenticate('local', { successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: '用户名与密码不匹配',
        successFlash: '欢迎回来'
    })
);



router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/home',sureLogin.ensureLoggedIn(), function(req, res){
  res.render('home', {title: '工作台'});
});


router.route('/register')
.get(function(req, res){
    res.render('register', {});
})
.post(function(req, res){
    //var user = new User(req.body);
    //user.save(function(err){
    //    if(err){
    //       console.log(err);
    //    }
    //    req.flash('info', '注册成功');
    //    res.redirect('/login');
    //});
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
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
