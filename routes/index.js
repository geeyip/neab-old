var express = require('express');
var db = require('./../database/db.js');
var router = express.Router();
var User = require('./../database/model/User').User;


router.get('/', function(req, res, next) {

    db.open(function(err, db){
        if(!err){
            console.log('connect');
            db.collection('person',{safe:true}, function(err, col){
                if(err){
                    console.log(err);
                }
                col.find().toArray(function(err,docs){
                    res.render('index', { title: '首页',persons: docs });
                });

            })

        }else{
            console.log(err);
        }
    });


});

router.route('/login')
.get(function(req, res){
  res.render('login', {title: '登录', username: req.flash('username')});
})
.post(function(req, res){
      var user={
        username: 'admin',
        password: '123456'
      }

        User.findOne({username: req.body.username, password:req.body.password}, function(err,user){
            if(user){
                req.session.user = user;
                req.flash('success', ['登录成功','欢迎您！'+user.username]);
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
    var user = req.body;
        console.log(user);
    if(user.password == user.password2){
        user = new User(user);
        user.save(function(err){
            if(err){
                res.json({flag:0,msg:err});
            }else{
                res.json({flag:1});
            }
        });
    }else{
        res.json({flag:0,msg:'2次密码不一样'});
    }
});


module.exports = router;
