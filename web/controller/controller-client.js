var async = require('co').wrap;
var mongoose = require('mongoose');
var Client = mongoose.model('Client');

exports.list = async(function* (req, res, next){
    try{
        var clients = yield Client.find();
        res.render('client/client-list',{title: '客户端',clients: clients});
    }catch (err){
        return next(err);
    }
});

exports.intoAdd = async(function* (req, res, next){
    try{
        res.render('client/client-add',{title: '新增'});
    }catch (err){
        return next(err);
    }
});

exports.keyCheck = async(function* (req, res, next){
    try{
        var role = yield Client.findOne({key: req.query.key});
        var status = role?404:200;
        res.writeHead(status);
        res.end();
    }catch(err){
        next(err);
    }
});

exports.add = async(function* (req, res, next){
    try{
        var client = new Client(req.body);
        yield client.save();
        req.flash('success','新增成功');
        res.redirect('/client');
    }catch (err){
        return next(err);
    }
});

exports.intoEdit = async(function* (req, res, next){
    try{
        var client = yield Client.findOne({key: req.params.key});
        res.render('client/client-edit',{title: '修改',client: client});
    }catch (err){
        return next(err);
    }
});

exports.edit = async(function* (req, res, next){
    try{
        yield Client.update({key: req.params.key}, req.body);
        req.flash('success','修改成功');
        res.redirect('/client');
    }catch (err){
        return next(err);
    }
});

exports.delete = async(function* (req, res, next){
    try{
        var key = req.params.key;
        yield Client.remove({key: key});
        req.flash('success','删除成功');
        res.redirect('/client');
    }catch (err){
        return next(err);
    }
});

