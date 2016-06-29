var express = require('express');
var user = require('./users');
var role = require('./roles');
var resource = require('./resources');
/**
 * 路由配置入口
 * @param app
 */
module.exports = function(app){
    app.use('/', require('./index'));
    app.use('/profile', require('./profile'));
    app.use('/upload', require('./upload'));

    //用户管理
    app.get('/users', user.list);
    app.get('/users/delete/:username', user.delete);
    app.get('/users/edit/:username', user.intoEdit);
    app.post('/users/edit/:username', user.submitEdit);
    app.get('/users/roles/:username', user.intoGrantRole);
    app.post('/users/roles/:username', user.submitGrantRole);

    //角色管理
    app.get('/roles', role.list);
    app.get('/roles/add', role.intoAdd);
    app.post('/roles/add', role.submitAdd);
    app.get('/roles/add/key_check', role.keyCheck);
    app.get('/roles/add/name_check', role.nameCheck);
    app.get('/roles/edit/name_check/:name', role.editNameCheck);
    app.get('/roles/delete/:key', role.delete);4
    app.get('/roles/edit/:key', role.intoEdit);
    app.post('/roles/edit/:key', role.submitEdit);
    app.get('/roles/users/:key', role.intoSelectUser);
    app.post('/roles/users/:key', role.submitSelectUser);
    app.get('/roles/resources/:key', role.intoGrantResurce);
    app.post('/roles/resources/:key', role.submitGrantResurce);

    //资源管理
    app.get('/resources', resource.list);
    app.get('/resources/add', resource.intoAdd);
    app.post('/resources/add', resource.submitAdd);
    app.get('/resources/add/key_check' ,resource.keyCheck);
    app.get('/resources/delete/:key', resource.delete);
    app.get('/resources/edit/:key', resource.intoEdit);
    app.post('/resources/edit/:key', resource.submitEdit);

}