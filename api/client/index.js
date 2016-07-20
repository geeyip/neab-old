var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var Client = mongoose.model('Client');

/**
 * 客户端最新版本号
 */
router.get('/version', function(req, res, next) {
    try{
        var confPath = path.join(__dirname,'resource/version.json');
        delete require.cache[confPath];
        var pkg = require('./resource/version.json');
        res.jsonp(pkg.version);
    }catch (e){
        res.jsonp('0.0.0');
    }
});

/**
 * 下载升级包
 */
router.get('/version/:name', function(req, res, next) {
    var url = path.join(__dirname,'resource',req.params.name);
    res.download(url, function(err){
        if (err) {
            console.log(err);
            res.end("404");
        }
    });
});

/**
 * 部署地集合
 */
router.get('/servers', function(req, res, next) {
    Client.find({}, function (err, data) {
        if(err){
            res.jsonp([]);
        }else{
            res.jsonp(data);
        }
    })
});


module.exports = router;
