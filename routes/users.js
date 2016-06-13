var express = require('express');
var router = express.Router();
var Account = require('../models/account');

router.get('/', function(req, res){
    var condition = {};
    if( req.query.q){
        condition.username = new RegExp(req.query.q);
    }
    Account.find(condition,function(err, users){
        res.render('index', { title: '用户列表', users: users, q: req.query.q});
    });
});

module.exports = router;