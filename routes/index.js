var express = require('express');
var router = express.Router();
var Account = require('mongoose').model('Account');
var passport = require('passport');
var ACL = require('../src/acl');
var async = require('co').wrap;
var Person = require('mongoose').model('Person');
router.get('/', function(req, res, next) {
    Person.paginate({}, {page: req.query.page, limit: req.query.limit}, function(err, result) {
        res.render('index',{title: '首页',result: result});
    });

});

router.get('/login', function(req, res){
    //for(var i=1;i<1000;i++){
    //    var person = {
    //        name: '张大'+i,
    //        age: 10+i,
    //        address: '杭州'+i
    //    }
    //    person = new Person(person);
    //    person.save();
    //
    //}
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
module.exports = router;
