var async = require('co').wrap;
var mongoose = require('mongoose');
var Entry = mongoose.model('Entry');
var moment = require('moment');
var userStore = require('./../../api/online/userStore');


exports.users = async(function* (req, res, next){
    try{
        var users = userStore.getUsers();
        res.render('online/online-users',{title: '在线用户',users: users});
    }catch (err){
        return next(err);
    }
});

exports.logs = async(function* (req, res, next){
    try{
        var query = req.query;
        var condition = {};
        if(query.userId){
            condition['userId'] = new RegExp(query.userId);
        }

        if(query.dateBegin){
            condition['logTime'] = {};
            condition['logTime']['$gte'] = moment(query.dateBegin);
        }
        if(query.dateEnd){
            condition['logTime'] = condition['logTime'] || {};
            condition['logTime']['$lt'] = moment(query.dateEnd).add(1,'days');
        }
        console.log(condition);
        var result = yield Entry.paginate(condition, {page: req.query.page,limit: req.query.limit, sort: {'logTime':-1}});
        res.render('online/online-logs',{title: '在线日志', result: result, query: query});
    }catch (err){
        return next(err);
    }
});



