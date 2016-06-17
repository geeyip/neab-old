var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var Role = mongoose.model('Role');
var ACL  = require('../src/acl');
var _ = require('underscore');
router.get('/', function(req, res){

    var condition = {};
    if( req.query.q){
        condition.username = new RegExp(req.query.q);
    }
    Account.find(condition,function(err, users){
        res.render('security/user-list', { title: '用户', users: users, q: req.query.q});
    });
});

router.get('/delete/:username', function(req, res){
    var userId = req.params.username;
    Account.remove({username: userId},function(err){
       if(err) console.log(err);
        ACL.userRoles(userId, function(err, roles){
            ACL.removeUserRoles(userId, roles);
        })
        req.flash('success','删除成功');
        res.redirect('/users');
    });
});

router.get('/edit/:username', function(req, res){
    Account.findByUsername(req.params.username, function(err, user){
        res.render('security/user-edit', {title: '修改用户', user: user});
    });
});

router.post('/edit/:username', function(req, res){
    Account.findByUsername(req.params.username,function(err,_user){
        Account.update({_id:_user._id},req.body,function(err){
            res.redirect('/users');
        });
    });
});

router.get('/roles/:username', function(req, res){
    var userId = req.params.username;
    Account.findByUsername(userId, function(err, user){
        ACL.userRoles(userId, function(err, userRoles){
            Role.find(function(err,roles){
                res.render('security/user-roles', {title: '选择角色', roles: roles, userRoles: userRoles, user: user});
            });
        });
    });


});

router.post('/roles/:username', function(req, res){
    var userId = req.params.username;
    var newUserRoles = req.body.userRoles;
    newUserRoles = newUserRoles==undefined?[]:newUserRoles;
    ACL.userRoles(userId, function(err, userRoles){
        ACL.removeUserRoles(userId, userRoles, function(err){
            ACL.addUserRoles(userId, newUserRoles, function(err){
                req.flash('success','授权完成');
                res.redirect('/users');
            });
        });
    });

});

module.exports = router;