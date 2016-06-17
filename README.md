# neab

### 主要技术
* 使用 [Express 4.x](https://github.com/expressjs/express) 作为主框架, 使用[swig](https://github.com/paularmstrong/swig)为视图模板引擎
* 前端页面样式布局使用[Bootstrap 3.x](https://github.com/twbs/bootstrap) ，表单验证使用[Parsley](https://github.com/guillaumepotier/Parsley.js)
* 数据库使用`MongoDB` , 并使用[Mongoose](https://github.com/Automattic/mongoose)操作数据库
* 登录认证使用[passport.js](https://github.com/jaredhanson/passport), 资源权限控制(ACL)使用[node-acl](https://github.com/OptimalBits/node_acl)
* 实时双向通信使用[socket.io](https://github.com/socketio/socket.io)

### MongoDB地址配置

修改`conf`目录下`setting.js`文件,配置`db_url` 参数
```javascript
 "db_url": "mongodb://localhost:27017/neab",
```

### 运行
```shell
 npm install && npm start
```

### 访问
````http
  http://localhost:3000
```
启动后，`管理`下`用户`、`角色`、`资源` 都没有访问权限。为了能配置权限，需暂时修改 `conf/resource.json`文件。
加入下面带注释部分
```javascript
{
  "not_need_auth": [
    "/login",
    "/logout",
    "/signup",
    "/signup/user/exits"
  ],
  "not_need_grant": [
    "/profile",
    "/profile/password",
    "/users/eidt",  //用户修改
    "/users/delete",//用户删除
    "/users/roles", //用户选择角色
    "/roles/add",    //角色新增
    "/roles/edit",  //角色修改
    "/roles/delete", //角色删除
    "/roles/users"   //角色选择用户
    "/roles/resources", //角色资源授权
    "/resources/add",  //资源新增
    "/resources/edit", //资源修改
    "/resources/delete" //资源删除
  ]
}
```
配置完成后，恢复文件即可。


