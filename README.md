# neab

### 主要技术
* 使用 [Express 4.x](https://github.com/expressjs/express) 作为主框架, 使用[swig](https://github.com/paularmstrong/swig)为视图模板引擎
* 前端页面样式布局使用[Bootstrap 3.x](https://github.com/twbs/bootstrap) ，表单验证使用[Parsley](https://github.com/guillaumepotier/Parsley.js)
* 数据库使用`MongoDB` , 并使用[Mongoose](https://github.com/Automattic/mongoose)操作数据库
* 登录认证使用[passport.js](https://github.com/jaredhanson/passport), 资源权限控制(ACL)使用[node-acl](https://github.com/OptimalBits/node_acl)
* 实时双向通信使用[socket.io](https://github.com/socketio/socket.io)

### MongoDB配置

conf > setting.js 配置 db_url
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

