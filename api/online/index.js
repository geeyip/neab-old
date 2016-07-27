var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var Entry = mongoose.model('Entry');
var moment = require('moment');
var async = require('co').wrap;
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
 * 登录登出日志
 */
router.post('/logs', async(function* (req, res){
    try{
        //查询条件
        var condition = JSON.parse(req.body.jsonStr);
        //初始化数据查询器
        var query = setQueryCondition(Entry.find(), condition);
        //初始化数量查询器
        var count = setQueryCondition(Entry.count(), condition);
        //取得总数
        var totalCount = yield count.exec();
        //分页条件
        query = setPageLimit(query, condition);
        //排序条件
        query = setSort(query, condition);
        //取得查询数据
        var data = yield query.exec();
        //格式化数据
        var formatData = formatLogData(data, condition.begin);
        res.jsonp({
            flag: 1,
            totalCount: totalCount,
            data: formatData
        });

    }catch (err){
        console.log(err);
        var data =
        res.jsonp({
            flag: 0,
            msg: err.message
        });
    }

}));

/**
 * 设置查询条件
 * @param query
 * @param condition
 * @returns {*}
 */
function setQueryCondition(query, condition) {
    if(condition.oprUser){
        query.where('userId').equals(condition.oprUser);
    }
    if(condition.logDateBegin){
        query.where('logTime').gte(moment(condition.logDateBegin));
    }
    if(condition.logDateEnd){
        query.where('logTime').lt(moment(condition.logDateEnd).add(1,'days'));
    }
    return query;
}

/**
 * 设置分页条件
 * @param query
 * @param condition
 */
function setPageLimit(query, condition){
    var skip =  condition.begin - 1;
    var limit = condition.end - skip;
    return query.skip(skip).limit(limit);
}

/**
 * 设置排序条件
 * @param query
 * @param condition
 */
function setSort(query, condition){
    var sort = '-logTime';
    if(condition.sortName == 'LOG_TIME'){
        sort = condition.sortOrder == 'desc'?'-logTime':'logTime';
    }else if(condition.sortName == 'OFF_TIME'){
        sort = condition.sortOrder == 'desc'?'-offTime':'offTime';
    }
    return query.sort(sort);
}

/**
 * 格式化数据
 * @param logs
 * @param begin
 * @returns {Array}
 */
function formatLogData(logs, begin) {
    var result = [];
    var i = 0;
    logs.forEach(function(log) {
        var obj = {
            oprUser: log.userId,
            oprUserName: log.userName,
            oprUnit: log.userUnit,
            logTime: log.logTime1,
            offTime: log.offTime1,
            ip: log.ip.replace('::ffff:',''),
            rn: begin+i
        };
        i++;
        result.push(obj);
    });
    return result;
}


module.exports = router;
