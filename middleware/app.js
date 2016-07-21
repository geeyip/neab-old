global._ = require('underscore');
global.async = require('co').wrap;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var pkg = require('./../package.json');
var session = require('express-session');
var setting = require('../resource/setting.json');
var flash = require('connect-flash');
var paginate = require('express-paginate');

var app = express();

/**
 * 模板设置
 */
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, '..', 'web/view'));
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, '..','public', 'img', 'favicon.ico')));
//传统上传文件，上传时文件太大而导致无法上传，通过以下方法设置上传最大限制
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(session({
    secret: setting.session_secret,
    //cookie: {maxAge: 1000*60*15 },
    //rolling: true,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(paginate.middleware(15, 100));


app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

require('./app-mongoose');
require('./../web/model/initialize')();
require('./app-security')(app);
require('./app-helper')(app, pkg.name);
require('./app-logger')(app);
require('./../web/route')(app);
require('./../api/api')(app);
require('./app-error')(app);

module.exports = app;
