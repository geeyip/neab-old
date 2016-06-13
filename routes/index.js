var express = require('express');
var router = express.Router();
var Account = require('mongoose').model('Account');
var passport = require('passport');
router.get('/', function(req, res, next) {
   res.redirect('users');
});

router.get('/login', function(req, res){
    res.render('login', {title:'登录', username : req.flash('username') });
})

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login',failureFlash: true}),
    function(req, res) {
        var returnTo = req.session.returnTo;
        if(returnTo == undefined) returnTo = '/';
        res.redirect(returnTo);
    });

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
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
