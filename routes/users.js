var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Account = mongoose.model('Account');

router.get('/', function(req, res){

    var condition = {};
    if( req.query.q){
        condition.username = new RegExp(req.query.q);
    }
    Account.find(condition,function(err, users){
        res.render('security/user-list', { title: '用户列表', users: users, q: req.query.q});
    });
});

router.get('/delete/:username', function(req, res){
    Account.remove({username: req.params.username},function(err){
       if(err) console.log(err);
        req.flash('success','删除成功');
        res.redirect('/users');
    });
});

router.get('/edit/:username', function(req, res){
    Account.findByUsername(req.params.username, function(err, user){
        res.render('security/user-edit', {title: '用户编辑', user: user});
    });
});

router.post('/edit/:username', function(req, res){
    Account.findByUsername(req.params.username,function(err,_user){
        Account.update({_id:_user._id},req.body,function(err){
            res.redirect('/users');
        });
    });
});
module.exports = router;