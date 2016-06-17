var express = require('express');
var router = express.Router();
var Account = require('mongoose').model('Account');
var passport = require('passport');
var ACL = require('../src/acl');
router.get('/', function(req, res, next) {
   res.render('index',{title: '首页'});
});

router.get('/login', function(req, res){
    res.render('login', {title:'登录', username : req.flash('username') });
});

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login',failureFlash: true}),
    function(req, res) {
        req.session.userId = req.user.username;
        var returnTo = req.session.returnTo==undefined?'/':req.session.returnTo;
        res.redirect(returnTo);
    }
);

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});

router.get('/signup', function(req, res){
    res.render('signup', {title: '注册'});
});

router.get('/signup/user/exits', function(req, res){
    Account.findByUsername(req.query.username, function(err, user){
        if(err) console.log(err);
        if(user){
            res.writeHead(404);
            res.end();
        }else{
            res.writeHead(200);
            res.end();
        }
    });
});

router.post('/signup', function(req, res){
    Account.register(new Account({
        username : req.body.username,
        email: req.body.email
    }), req.body.password, function(err, account) {
        if (err) {
            console.log(err);
            return res.render('signup', {error : [err.message] });
        }
        passport.authenticate('local')(req, res, function() {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
 });

router.get('/unlock/user/:username', function(req, res){
    Account.findByUsername(req.params.username, function(err, user){
       if(err) console.log(err);
        if(user){
            new Account(user).resetAttempts(function(err, model, passwordErr){
                if(err) console.log(err);
                res.send('解锁成功');
            });
        }else{
            res.send('解锁失败');
        }
    });
});
module.exports = router;
