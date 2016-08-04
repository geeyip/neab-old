var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var Client = mongoose.model('Client');



/**
 * 客户端最新版本号
 */
router.get('/version', function(req, res, next) {
    try{
        var confPath = path.join(__dirname,'resource/report/report.json');
        delete require.cache[confPath];
        var pkg = require('./resource/report/report.json');
        res.json(pkg.version);
    }catch (e){
        res.json('0.0.0');
    }
});



/**
 * 下载升级包
 */
router.get('/version/:name', function(req, res, next) {
    var url = path.join(__dirname,'resource/report',req.params.name);
    var flag = fs.existsSync(url);
    if(flag){
        res.download(url, function(err){
            if (err) {
                console.log(err);
                res.end("404");
            }
        });
    }else{
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }

});

/**
 * 部署地集合
 */
router.get('/servers', function(req, res, next) {
    Client.find({}, function (err, data) {
        if(err){
            res.json([]);
        }else{
            res.json(data);
        }
    })
});


/**
 * 一体化最新版本号
 */
router.get('/one/version', function(req, res, next) {
    try{
        var confPath = path.join(__dirname,'resource/one/one.json');
        delete require.cache[confPath];
        var pkg = require('./resource/one/one.json');
        res.json(pkg.version);
    }catch (e){
        res.json('0.0.0');
    }
});



/**
 * 下载一体化升级包
 */
router.get('/one/version/:name', function(req, res, next) {
    var url = path.join(__dirname,'resource/one',req.params.name);
    var flag = fs.existsSync(url);
    if(flag){
        res.download(url, function(err){
            if (err) {
                console.log(err);
                res.end("404");
            }
        });
    }else{
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }

});



module.exports = router;
