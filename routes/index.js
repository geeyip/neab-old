var express = require('express');
var db = require('./../database/db.js');
var router = express.Router();
var session = require('express-session');
/* GET home page. */
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
  res.render('login', {title: '登录'});
})
.post(function(req, res){
      var user={
        username: 'admin',
        password: '123456'
      }
      if(req.body.username === user.username && req.body.password === user.password){
          req.session.user = user;
          res.redirect('/home');
      }else{
          res.redirect('/login');
      }
});

router.get('/logout', function(req, res){
    req.session.user = null;
    res.redirect('/');
});

router.get('/home', function(req, res){
  res.render('home', {title: '工作台', user: req.session.user});
});
module.exports = router;
