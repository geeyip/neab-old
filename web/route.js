var index = require('./controller/controller-index');
var user = require('./controller/controller-users');
var role = require('./controller/controller-roles');
var resource = require('./controller/controller-resources');
var client = require('./controller/controller-client');
var online = require('./controller/controller-online');
/**
 * 路由配置入口
 * @param app
 */
module.exports = function(app){

    app.use('/', require('./router/security'));
    app.use('/upload', require('./router/upload'));

    //首页
    app.get('/', index.list);

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
    app.get('/roles/delete/:key', role.delete);
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

    //客户端
    app.get('/client', client.list);
    app.get('/client/add', client.intoAdd);
    app.get('/client/add/key_check', client.keyCheck);
    app.post('/client/add', client.add);
    app.get('/client/edit/:key', client.intoEdit);
    app.post('/client/edit/:key', client.edit);
    app.get('/client/delete/:key', client.delete);

    //在线
    app.get('/online/users', online.users);
    app.get('/online/logs', online.logs);


}