var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var Entry = mongoose.model('Entry');


var userStore = require('./userStore');
var socketStore = require('./socketStore');

/**
 * 在线用户
 */
router.get('/users', function(req, res){
    var users = userStore.getUsers();
    res.jsonp(users);
});

/**
 * 在线用户
 */
router.post('/logs', function(req, res){
    try{
        //:{"jsonStr":"{\"oprUser\":\"\",\"logDateBegin\":\"2016-07-20\",\"logDateEnd\":\"2016-07-20\",\"begin\":1,\"end\":60}","token":"ea6bf7fe87574c31b91a6ac028360570"}
        var query = JSON.parse(req.body.jsonStr);
        var condition = {};
        if(query.oprUser){
            condition.oprUser = query.oprUser;
        }
        // if(query.logDateBegin){
        //     condition.logTime = {$gte: new Date(query.logDateBegin)};
        // }
        // if(query.logDateEnd){
        //     var logTime =  condition.logTime || {};
        //     logTime.$lt =  new Date(req.query.age2)+1;
        //     condition.logTime = logTime;
        // }

        // Entry.paginate(condition, {page: req.query.page,limit: req.query.limit, sort: req.query.sort}, function (err, result) {
        //     var data = {
        //         flag: 1,
        //         totalCount: result.total,
        //         data: result.docs
        //     }
        //     res.jsonp(data);
        // });
        Entry.find({}, function (err, data) {
            var data = {
                flag: 1,
                data: data
            }
            res.jsonp(data);
        });


    }catch (err){
        var data = {
            flag: 0,
            msg: err
        }
        res.jsonp(data);
    }

});



module.exports = router;
