var express = require('express');
var router = express.Router();
var Role = require('../models/role');

router.get('/', function(req, res){
    Role.find(function(err, roles){
        res.render('security/role-list', { title: '角色列表', roles: roles});
    });
});
router.get('/add', function(req, res){
    res.render('security/role-add', { title: '角色新增'});
});
router.post('/add', function(req, res){
    var role = new Role(req.body);
    role.save(function(err){
        res.redirect('/roles');
    });
});
router.get('/add/key_check', function(req, res){
    Role.findOne({key: req.query.key}, function(err, role){
        if(err) console.log(err);
        console.log(role);
        if(role){
            res.writeHead(404);
            res.end();
        }else{
            res.writeHead(200);
            res.end();
        }
    });
});
router.get('/add/name_check', function(req, res){
    Role.findOne({name: req.query.name}, function(err, role){
        if(err) console.log(err);
        console.log(role);
        if(role){
            res.writeHead(404);
            res.end();
        }else{
            res.writeHead(200);
            res.end();
        }
    });
});
router.get('/edit/name_check/:name', function(req, res){
    if(trim(req.query.name) == req.params.name){
        res.writeHead(200);
        res.end();
    }else{
        Role.findOne({name: req.query.name}, function(err, role){
            if(err) console.log(err);
            console.log(role);
            if(role){
                res.writeHead(404);
                res.end();
            }else{
                res.writeHead(200);
                res.end();
            }
        });
    }

});
router.get('/delete/:key', function(req, res){
    Role.remove({key: req.params.key},function(err){
        if(err) console.log(err);
        req.flash('success','删除成功');
        res.redirect('/roles');
    });
});
router.get('/edit/:key', function(req, res){
    Role.findOne({key: req.params.key},function(err,role){
        console.log(role);
        if(err) console.log(err);
        res.render('security/role-edit', { title: '角色修改', role: role});
    });
});
router.post('/edit/:key', function(req, res){
    Role.update({key: req.params.key},req.body,function(err){
        if(err) console.log(err);
        req.flash('success','删除成功');
        res.redirect('/roles');
    });
});

module.exports = router;