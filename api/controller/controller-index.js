var async = require('co').wrap;
var mongoose = require('mongoose');
var Person = mongoose.model('Person');

exports.list = async(function* (req, res, next){
    try{
        var condition = {};
        if(req.query.username){
            condition.username = req.query.username;
        }
        if(req.query.age1){
            var age1 =  parseInt(req.query.age1);
            condition.age = {$gte: age1};
        }
        if(req.query.age2){
            var age =  condition.age || {};
            age.$lte =  parseInt(req.query.age2);
            condition.age = age;
        }
        console.log(condition);
        var result = yield Person.paginate(condition, {page: req.query.page,limit: req.query.limit, sort: req.query.sort});
        res.render('index',{title: '首页',result: result,query: req.query});
    }catch (err){
        return next(err);
    }
});
