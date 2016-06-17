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
    "/profile/password"
  ]
}
```
在数组`not_need_grant`中加入
```
  "/users",
  "/users/edit",
  "/users/delete",
  "/users/roles",
  "/roles",
  "/roles/add",
  "/roles/edit",
  "/roles/delete",
  "/roles/users",
  "/roles/resources",
  "/resources",
  "/resources/add",
  "/resources/edit",
  "/resources/delete"
```
配置好资源访问权限后，恢复文件即可。

### 如何配置资源
资源的访问权限控制和`url`相关联,例如`用户`的`URL`如下
  ```url
  /users
  /users/edit
  /users/delete
  /users/roles
   ```
  则资源和权限配置如下
  ![](https://raw.githubusercontent.com/geeyip/techMD/master/pic/p0.png)
  
  角色资源授权
  ![](https://raw.githubusercontent.com/geeyip/techMD/master/pic/p7.png)

