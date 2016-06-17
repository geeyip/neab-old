var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var acl = require('acl');
var app = express();

app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./src/mongoose')();
require('./models/security')();
require('./src/session')(app);
require('./src/passport')(app);
require('./src/logger')(app);
require('./src/flash')(app);
require('./routes/main')(app);
require('./src/error')(app);

module.exports = app;
