﻿var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var passport = require('passport');
var AzureTablesStore = require('connect-azuretables')(session);
var app = express();

//security headers
app.set('x-powered-by', false);
var ninetyDaysInMilliseconds = 7776000000;
app.use(helmet.hsts({ maxAge: ninetyDaysInMilliseconds }));
app.use(helmet.frameguard('deny'));
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
// can't currently use CSP as i would like because various 3rd party libs are using inline style and javascript eval()
app.use(helmet.csp({
    directives: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'self'", "'unsafe-eval'"], //needed for lodash and nools
        connectSrc: ["'self'"],
        styleSrc: ["'self'", 'http://fonts.googleapis.com', 'https://fonts.googleapis.com', "'unsafe-inline'"], //needed for jquery
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'", 'http://fonts.gstatic.com', 'https://fonts.gstatic.com'],
        formAction: ["'self'"],
        reportUri: 'https://report-uri.io/report/owaspthreatdragon'
    }
}));

//static content
app.use('/public', express.static(path.join(__dirname, 'public')));

//sessions
app.use(session({ 
    store: new AzureTablesStore(), 
    secret: process.env.SESSION_SIGNING_KEY, 
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/configpassport');

//routes
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
var routes = require('./config/configroutes');
app.use('/', routes);

//middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//// catch 404 and forward to error handler
//app.use(function (req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

//// error handlers

//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function (err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}

//// production error handler
//// no stacktraces leaked to user
//app.use(function (err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});


module.exports = app;
