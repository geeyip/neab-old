var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Resource = mongoose.model('Resource');
var _ = require('underscore');
var ACL = require('../src/acl');
router.get('/', function(req, res){
    Resource.find(function(err, resources){
        res.render('security/resource-list', { title: '资源', resources: resources});
    });
});
router.get('/add', function(req, res){
    res.render('security/resource-add', { title: '新增资源'});
});
router.post('/add', function(req, res){
    var keys = req.body.permissionKey;
    var names = req.body.permissionName;
    var permission = _.object(keys, names);
    var resource = new Resource(req.body);
    resource.permission = permission;
    resource.save(function(err){
        res.redirect('/resources');
    });
});
router.get('/add/key_check', function(req, res){
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
});

router.get('/delete/:key', function(req, res){
    var resourceId = req.params.key;
    Resource.remove({key: resourceId},function(err){
        if(err) console.log(err);
        ACL.removeResource(resourceId, function(err){
            req.flash('success','删除成功');
            res.redirect('/resources');
        });
    });
});
router.get('/edit/:key', function(req, res){
    Resource.findOne({key: req.params.key},function(err,resource){
        if(err) console.log(err);
        res.render('security/resource-edit', { title: '修改资源', resource: resource});
    });
});
router.post('/edit/:key', function(req, res){
    var resource = req.body;
    var keys = req.body.permissionKey;
    var names = req.body.permissionName;
    resource.permission = _.object(keys, names);
    Resource.update({key: req.params.key}, resource, function(err){
        if(err) console.log(err);
        req.flash('success','修改成功');
        res.redirect('/resources');
    });
});

module.exports = router;