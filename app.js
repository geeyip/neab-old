var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodedb');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function (callback) {
  console.log('connect to mongodb success');
});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({
   secret: 'geeyip',
   cookie: {maxAge: 600000 },
   resave: true,
   saveUninitialized: false,
  store: new MongoStore({   //创建新的mongodb数据库
      url: 'mongodb://localhost/nodedb',
      ttl: 600
  })

}));

app.use(function(req, res, next){
  res.locals.user = req.session.user;

  res.locals.info =  req.flash('info');
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.warning = req.flash('warning');

  next();
});


app.use(function(req,res,next){
  console.log(req.path);
  if(req.session.user || req.path == '/login' || req.path == '/register' || req.path == '/'){
    next();
  }else{
    res.redirect('/login');
  }
});


app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
