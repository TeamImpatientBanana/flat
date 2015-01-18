
/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var csrf = require('lusca').csrf();
var methodOverride = require('method-override');
var multipart = require('connect-multiparty');


var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Controllers (route handlers).
 */

var indexController = require('./controllers/index');
var uploadController = require('./controllers/upload');
var contactController = require('./controllers/contact');
var testController = require('./controllers/test');
var replyController = require('./controllers/reply');


/**
 * API keys and Passport configuration.
 */

var secrets = require('./config/secrets');

/**
 * Create Express server.
 */

var app = express();


/**
 * Connect to MongoDB.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});


/**
 * CSRF whitelist.
 */

var csrfExclude = ['/reply', '/upload'];


/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(connectAssets({
  paths: ['public/css', 'public/js'],
  helperContext: app.locals
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multipart());
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, auto_reconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  // CSRF protection.
  if (_.contains(csrfExclude, req.path)) return next();
  csrf(req, res, next);
});
app.use(function(req, res, next) {
  // Make user object available in templates.
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  // Remember original destination before login.
  var path = req.path.split('/')[1];
  if (/auth|login|logout|signup|fonts|favicon/i.test(path)) {
    return next();
  }
  req.session.returnTo = req.path;
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next();
});


/**
 * Main routes.
 */

app.get('/', indexController.index);
app.post('/upload', uploadController.postUpload);
app.get('/upload/:id', uploadController.getUpload);
app.get('/reply/:id', replyController.getReply);
app.post('/reply', replyController.postReply);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/test', testController.index);

/**
 * 500 Error Handler.
 */

app.use(errorHandler());


/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;