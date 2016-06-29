var express = require('express');
var router = express.Router();
var Account = require('mongoose').model('Account');
var passport = require('passport');
var ACL = require('../core/app-acl');
var async = require('co').wrap;
var Person = require('mongoose').model('Person');


router.get('/', async(function *(req, res, next) {
    try{
        var condition = {};
        if(req.query.username){
            condition.username = req.query.username;
        }
        if(req.query.age1){
            var age1 =  parseInt(req.query.age1);
            condition.age = {$gte: age1};
        }
        if(req.query.age2){
            var age =  condition.age || {};
            age.$lte =  parseInt(req.query.age2);
            condition.age = age;
        }
        console.log(condition);
        var result = yield Person.paginate(condition, {page: req.query.page,limit: req.query.limit, sort: req.query.sort});
        res.render('index',{title: '首页',result: result,query: req.query});
    }catch (err){
        return next(err);
    }
}));

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


var userStore = require('./../socket/userStore');
var socketStore = require('./../socket/socketStore');


router.get('/online', function(req, res){
    var users = userStore.getUsers();
    var sockets = socketStore.getSockets();
    res.render('index', { title: '在线用户', users: users, sockets: sockets });
});

module.exports = router;
