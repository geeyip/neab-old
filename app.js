var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var pkg = require('./package.json');
var session = require('express-session');
var setting = require('./conf/setting.json');
var flash = require('connect-flash');
var paginate = require('express-paginate');

var app = express();

app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: setting.session_secret,
    // cookie: {maxAge: 1000*60*30 },
    // rolling: true,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(require('./src/helper')(pkg.name));
app.use(paginate.middleware(50, 100));
require('./src/mongoose')();
require('./models/security')();
require('./models/person')();
require('./src/passport')(app);
require('./src/logger')(app);
require('./routes/main')(app);
require('./src/error')(app);

module.exports = app;
