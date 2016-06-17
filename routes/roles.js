var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Role = mongoose.model('Role');
var Account = mongoose.model('Account');
var ACL  = require('../src/acl');
var _ = require('underscore');
var Resource = mongoose.model('Resource');

router.get('/', function(req, res){
    Role.find(function(err, roles){
        res.render('security/role-list', { title: '角色', roles: roles});
    });
});
router.get('/add', function(req, res){
    res.render('security/role-add', { title: '新增角色'});
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
    if(req.query.name == req.params.name){
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
    var roleId = req.params.key;
    Role.remove({key: roleId},function(err){
        if(err) console.log(err);
        ACL.removeRole(roleId, function(err){
            req.flash('success','删除成功');
            res.redirect('/roles');
        });
    });
});
router.get('/edit/:key', function(req, res){
    Role.findOne({key: req.params.key},function(err,role){
        if(err) console.log(err);
        res.render('security/role-edit', { title: '修改角色', role: role});
    });
});
router.post('/edit/:key', function(req, res){
    Role.update({key: req.params.key},req.body,function(err){
        if(err) console.log(err);
        req.flash('success','删除成功');
        res.redirect('/roles');
    });
});
router.get('/users/:key', function(req, res){
    var roleId = req.params.key;
    Role.findOne({key: roleId}, function(err, role){
        ACL.roleUsers(roleId, function(err, roleUsers){
            Account.find(function(err, users){
                res.render('security/role-users', { title: '选择用户', users: users, roleUsers: roleUsers, role: role});
            });
        });
    });
});
router.post('/users/:key', function(req, res){
    var roleId = req.params.key;
    var newRoleUsers = req.body.roleUsers;
    newRoleUsers = newRoleUsers==undefined?[]:newRoleUsers;
    newRoleUsers = _.isArray(newRoleUsers)?newRoleUsers:[newRoleUsers];
    ACL.roleUsers(roleId, function(err, roleUsers){
        var insertArray = _.difference(newRoleUsers, roleUsers);
        var deleteArray = _.difference(roleUsers, newRoleUsers);
        _.each(insertArray, function(userId){
            ACL.addUserRoles(userId, roleId);
        });
        _.each(deleteArray, function(userId){
            ACL.removeUserRoles(userId, roleId);
        });
        res.redirect('/roles');
    });
});

router.get('/resources/:key', function(req, res){
    var roleId = req.params.key;
    Role.findOne({key: roleId}, function(err, role){
        ACL.whatResources(roleId, function(err, roleResources){
            console.log(roleResources);
            Resource.find(function(err, resources){
                res.render('security/role-resources', { title: '授权资源', resources: resources, roleResources: roleResources, role: role});
            });
        });
    });
});

router.post('/resources/:key', function(req, res) {
    var roleId = req.params.key;
    var resources = req.body.resources;
    resources = resources==undefined?[]:resources;
    resources = _.isArray(resources)?resources:[resources];
    console.log('============');
    console.log(resources);

    ACL.whatResources(roleId, function(err, roleResources){
        var keyResource = _.keys(roleResources);
        _.each(keyResource, function(resource){
            var permission = roleResources[resource];
            ACL.removeAllow(roleId, resource, permission, function(err){

            });
        });
        _.each(resources, function(resource){

            var permission = req.body[resource];
            permission = permission==undefined?[]:permission;
            permission.push(resource);
            ACL.allow(roleId, resource, permission,function(err){

            });
        });
        res.redirect('/roles');
    });

});
module.exports = router;