var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var Role = mongoose.model('Role');
var ACL  = require('../src/acl');
var _ = require('underscore');
var async = require('co').wrap;

router.get('/', async(function* (req, res, next){
    try{
        var condition = {};
        if(req.query.q){
            condition.username = new RegExp(req.query.q);
        }
        var users =  yield Account.find(condition);
        res.render('security/user-list', { title: '用户', users: users, q: req.query.q});
    }catch(err){
        return next(err);
    }
}));

router.get('/delete/:username', async(function* (req, res, next){
    try{
        var userId = req.params.username;
        yield Account.remove({username: userId});
        var roles = yield ACL.userRoles(userId);
        yield ACL.removeUserRoles(userId, roles);
        req.flash('success','删除成功');
        res.redirect('/users');
    }catch(err){
        return next(err);
    }
}));

router.get('/edit/:username', async(function* (req, res, next){
    try{
        var user = yield  Account.findByUsername(req.params.username);
        res.render('security/user-edit', {title: '修改用户', user: user});
    }catch(err){
        next(err);
    }
}));

router.post('/edit/:username', async(function* (req, res, next){
    try{
        var _user = yield Account.findByUsername(req.params.username);
        yield Account.update({_id:_user._id}, req.body);
        res.redirect('/users');
    }catch(err){
        next(err);
    }
}));

router.get('/roles/:username', async(function* (req, res, next){
    try{
        var userId = req.params.username;
        var user = yield Account.findByUsername(userId);
        var userRoles = yield ACL.userRoles(userId);
        var roles = yield Role.find();
        res.render('security/user-roles', {title: '选择角色', roles: roles, userRoles: userRoles, user: user});
    }catch(err){
        next(err);
    }
}));

router.post('/roles/:username', async(function* (req, res, next){
    try{
        var userId = req.params.username;
        var newUserRoles = req.body.userRoles;
        newUserRoles = newUserRoles==undefined?[]:newUserRoles;
        var userRoles = yield ACL.userRoles(userId);
        yield ACL.removeUserRoles(userId, userRoles);
        yield ACL.addUserRoles(userId, newUserRoles);
        req.flash('success','授权完成');
        res.redirect('/users');
    }catch(err){
        next(err);
    }
}));

module.exports = router;