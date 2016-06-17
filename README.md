# neab
## 主要技术

* 使用 `Express 4.x` 作为`Web`主框架, 视图模板使用`swig`
* 前端页面使用 `Bootstrap 3.x` 布局样式，表单验证使用`Parsley.js`
* 数据库使用`MongoDB` , 并使用`Mongoose`操作数据库
* 登录认证使用 `passport`, 资源权限控制使用 `node-acl`
* 实时双向通信使用`socket.io`

## MongoDB配置

conf > setting.js 配置 db_url
```javascript
 "db_url": "mongodb://localhost:27017/neab",
```

## 运行
```shell
 npm install && npm start
```
