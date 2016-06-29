var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Role = mongoose.model('Role');
var Account = mongoose.model('Account');
var ACL  = require('../src/acl');
var _ = require('underscore');
var Resource = mongoose.model('Resource');
var async = require('co').wrap;

//列表
exports.list = async(function* (req, res, next){
    try{
        var roles = yield Role.find();
        res.render('security/role-list', { title: '角色', roles: roles});
    }catch(err){
        next(err);
    }
});

//进入新增
exports.intoAdd = function(req, res){
    res.render('security/role-add', { title: '新增角色'});
};

//提交新增
exports.submitAdd =  async(function* (req, res, next){
    try{
        var role = new Role(req.body);
        yield role.save();
        res.redirect('/roles');
    }catch(err){
        next(err);
    }
});

exports.keyCheck = async(function* (req, res, next){
    try{
        var role = yield Role.findOne({key: req.query.key});
        var status = role?404:200;
        res.writeHead(status);
        res.end();
    }catch(err){
        next(err);
    }
});

exports.nameCheck = async(function* (req, res, next){
    try{
        var role = yield Role.findOne({name: req.query.name});
        var status = role?404:200;
        res.writeHead(status);
        res.end();
    }catch(err){
        next(err);
    }
});

exports.editNameCheck = async(function* (req, res, next){
    try{
        var status = 200;
        if(req.query.name != req.params.name){
            var role = yield  Role.findOne({name: req.query.name});
            var status = role?404:200;
        }
        res.writeHead(status);
        res.end();
    }catch(err){
        next(err);
    }
});

//删除
exports.delete = async(function* (req, res, next){
    try{
        var roleId = req.params.key;
        yield Role.remove({key: roleId});
        yield ACL.removeRole(roleId);
        req.flash('success','删除成功');
        res.redirect('/roles');
    }catch(err){
        next(err);
    }
});

//进入修改
exports.intoEdit =  function(req, res, next){
    Role.findOne({key: req.params.key},function(err,role){
        if(err) return next(err);
        res.render('security/role-edit', { title: '修改角色', role: role});
    });
};

//提交修改
exports.submitEdit = function(req, res, next){
    Role.update({key: req.params.key},req.body,function(err){
        if(err) return next(err);
        req.flash('success','删除成功');
        res.redirect('/roles');
    });
};

//进入选择用户
exports.intoSelectUser = async(function* (req, res, next){
    try{
        var roleId = req.params.key;
        var role = yield  Role.findOne({key: roleId});
        var roleUsers = yield ACL.roleUsers(roleId);
        var users = yield  Account.find();
        res.render('security/role-users', { title: '选择用户', users: users, roleUsers: roleUsers, role: role});
    }catch(err){
        next(err);
    }
});

//提交选择用户
exports.submitSelectUser = async(function* (req, res, next){
    try{
        var roleId = req.params.key;
        var newRoleUsers = req.body.roleUsers;
        newRoleUsers = newRoleUsers==undefined?[]:newRoleUsers;
        newRoleUsers = _.isArray(newRoleUsers)?newRoleUsers:[newRoleUsers];
        var roleUsers = yield ACL.roleUsers(roleId);
        var insertArray = _.difference(newRoleUsers, roleUsers);
        var deleteArray = _.difference(roleUsers, newRoleUsers);
        _.each(insertArray, function(userId){
            ACL.addUserRoles(userId, roleId);
        });
        _.each(deleteArray, function(userId){
            ACL.removeUserRoles(userId, roleId);
        });
        res.redirect('/roles');
    }catch(err){
        next(err);
    }
});

//进入资源授权
exports.intoGrantResurce =  async(function* (req, res, next){
    try{
        var roleId = req.params.key;
        var role = yield Role.findOne({key: roleId});
        var roleResources = yield ACL.whatResources(roleId);
        var resources = yield Resource.find();
        res.render('security/role-resources', { title: '授权资源', resources: resources, roleResources: roleResources, role: role});
    }catch(err){
        next(err);
    }
});

//提交资源授权
exports.submitGrantResurce = async(function* (req, res, next) {
    try{
        var roleId = req.params.key;
        var resources = req.body.resources;
        resources = resources==undefined?[]:resources;
        resources = _.isArray(resources)?resources:[resources];
        var roleResources = yield ACL.whatResources(roleId);
        var keyResource = _.keys(roleResources);
        _.each(keyResource, function(resource){
            var permission = roleResources[resource];
            ACL.removeAllow(roleId, resource, permission);
        });
        _.each(resources, function(resource){
            var permission = req.body[resource];
            permission = permission==undefined?[]:permission;
            permission.push(resource);
            ACL.allow(roleId, resource, permission);
        });
        res.redirect('/roles');
    }catch(err){
        next(err);
    }
});
