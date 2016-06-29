var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Resource = mongoose.model('Resource');
var _ = require('underscore');
var ACL = require('../src/acl');

exports.list = function(req, res){
    Resource.find(function(err, resources){
        res.render('security/resource-list', { title: '资源', resources: resources});
    });
};

exports.intoAdd = function(req, res){
    res.render('security/resource-add', { title: '新增资源'});
};

exports.submitAdd = function(req, res){
    var keys = req.body.permissionKey;
    keys = _.isArray(keys)?keys:[keys];
    var names = req.body.permissionName;
    names = _.isArray(names)?keys:[names];
    var permission = _.object(keys, names);
    console.log(permission);
    var resource = new Resource(req.body);
    resource.permission = permission;
    resource.save(function(err){
        res.redirect('/resources');
    });
};

exports.keyCheck = function(req, res){
    Resource.findOne({key: req.query.key}, function(err, resource){
        if(err) console.log(err);
        if(resource){
            res.writeHead(404);
            res.end();
        }else{
            res.writeHead(200);
            res.end();
        }
    });
};

exports.delete =  function(req, res){
    var resourceId = req.params.key;
    Resource.remove({key: resourceId},function(err){
        if(err) console.log(err);
        ACL.removeResource(resourceId, function(err){
            req.flash('success','删除成功');
            res.redirect('/resources');
        });
    });
};

exports.intoEdit = function(req, res){
    Resource.findOne({key: req.params.key},function(err,resource){
        if(err) console.log(err);
        res.render('security/resource-edit', { title: '修改资源', resource: resource});
    });
};

exports.submitEdit = function(req, res){
    var resource = req.body;
    var keys = req.body.permissionKey;
    keys = _.isArray(keys)?keys:[keys];
    var names = req.body.permissionName;
    names = _.isArray(names)?keys:[names];

    resource.permission = _.object(keys, names);
    Resource.update({key: req.params.key}, resource, function(err){
        if(err) console.log(err);
        req.flash('success','修改成功');
        res.redirect('/resources');
    });
}
