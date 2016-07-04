var async = require('co').wrap;
var mongoose = require('mongoose');
var Resource = mongoose.model('Resource');

exports.list = async(function* (req, res, next){
    try{
        var resources = yield Resource.find();
        res.render('security/resource-list', { title: '资源', resources: resources});
    }catch(err){
        next(err);
    }
});

exports.intoAdd = async(function* (req, res, next){
    try{
        res.render('security/resource-add', { title: '新增资源'});
    }catch(err){
        next(err);
    }

});

exports.submitAdd = async(function* (req, res, next){
    try{
        var keys = req.body.permissionKey;
        keys = _.isArray(keys)?keys:[keys];
        var names = req.body.permissionName;
        names = _.isArray(names)?keys:[names];
        var permission = _.object(keys, names);
        var resource = new Resource(req.body);
        resource.permission = permission;
        yield resource.save();
        res.redirect('/resources');
    }catch(err){
        next(err);
    }
});

exports.keyCheck = async(function* (req, res, next){
    try{
        var resource = yield Resource.findOne({key: req.query.key});
        var status = resource?404:200;
        res.writeHead(status);
        res.end();
    }catch(err){
        next(err);
    }
});

exports.delete =  async(function*(req, res, next){
    try{
        var resourceId = req.params.key;
        yield Resource.remove({key: resourceId});
        yield ACL.removeResource(resourceId);
        req.flash('success','删除成功');
        res.redirect('/resources');
    }catch(err){
        next(err);
    }
});

exports.intoEdit = async(function*(req, res, next){
    try{
        var resource = yield Resource.findOne({key: req.params.key});
        res.render('security/resource-edit', { title: '修改资源', resource: resource});
    }catch(err){
        next(err);
    }
});

exports.submitEdit = async(function *(req, res, next){
    try {
        var resource = req.body;
        var keys = req.body.permissionKey;
        keys = _.isArray(keys)?keys:[keys];
        var names = req.body.permissionName;
        names = _.isArray(names)?keys:[names];
        resource.permission = _.object(keys, names);
        yield Resource.update({key: req.params.key}, resource);
        req.flash('success','修改成功');
        res.redirect('/resources');

    }catch(err){
        next(err);
    }
});
