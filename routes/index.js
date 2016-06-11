var express = require('express');
var db = require('./../database/db.js');
var router = express.Router();
var User = require('./../database/model/User').User;


router.get('/', function(req, res, next) {
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
  res.render('login', {title: '登录', username: req.flash('username')});
})
.post(function(req, res){
    User.findOne({username: req.body.username, password:req.body.password}, function(err,user){
        if(user){
            req.session.user = user;
            req.flash('success', ['欢迎您！'+user.username]);
            res.redirect('/home');
        }else{
            req.flash('error', '用户名或密码错误');
            req.flash('username', req.body.username);
            res.redirect('/login');
        }
    });
});

router.get('/logout', function(req, res){
    req.session.user = null;
    res.redirect('/');
});

router.get('/home', function(req, res){
  res.render('home', {title: '工作台'});
});


router.route('/register')
.get(function(req, res){
    res.render('register', {title: '注册', user: req.flash('user')});
})
.post(function(req, res){
    var user = new User(req.body);
    user.save(function(err){
        if(err){
           console.log(err);
        }
        req.flash('info', '注册成功');
        res.redirect('/login');
    });
});


module.exports = router;
