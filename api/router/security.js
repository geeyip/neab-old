var express = require('express');
var router = express.Router();
var Account = require('mongoose').model('Account');
var passport = require('passport');
var async = require('co').wrap;
var Person = require('mongoose').model('Person');


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

router.get('/signup/user/exits', async(function*(req, res, next){
    try{
        var user = yield Account.findByUsername(req.query.username);
        var status = user? 404 : 200;
        res.writeHead(status);
        res.end();
    }catch(err){
        next(err);
    }
}));

router.post('/signup', function(req, res, next){
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

router.get('/profile', function(req, res){1
    res.render('profile/profile', {title: '个人信息'});
});

router.get('/profile/password', function(req, res) {
    Account.findByUsername(req.user.username, function(err, user){
        res.render('profile/password-modify', {title: '密码修改', user: user})
    });
});
router.post('/profile/password', function(req, res) {
    var user = new Account(req.user);
    user.authenticate(req.body.prePassword, function(err, result){
        if(err) console.log(err);
        if(result){
            user.setPassword(req.body.password, function(err, newPassUser){
                if(err) console.log(err);
                newPassUser.save(function(err){
                    if(err) console.log(err);
                    req.flash('success','密码修改成功');
                    res.redirect('/profile');
                });
            });
        }else{
            req.flash('error','原密码错误');
            res.redirect('/profile/password');
        }
    });
});


var userStore = require('./../../socket/userStore');
var socketStore = require('./../../socket/socketStore');


router.get('/online', function(req, res){
    var users = userStore.getUsers();
    var sockets = socketStore.getSockets();
    res.render('online', { title: '在线用户', users: users, sockets: sockets });
});

module.exports = router;
