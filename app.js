var express = require('express');
var debug = require('debug')('registry');

var curry = require('./middleware/curry');
var req_hostname = require('./middleware/request_hostname');
var router = require('./routes');

var app = express();

// enables use of req.curry(fn) to handle error first callbacks
app.use(curry);
app.use(req_hostname);

app.use(function(req, res, next) {
    var auth_header = req.headers.authorization;
    if (!auth_header) {
        return next();
    }

    debug('Authorization header found');
    var token = auth_header.replace('Bearer ', '');

    debug('oauth token %s', token);
    req.oauth_token = token;
    next();
});

app.use(router);

// if not already handled, it is a 404
app.use(function(req, res, next) {
    res.status(404).end();
});

app.use(function(err, req, res, next) {
    var status = err.status || err.statusCode || 500;
    console.error(err.stack);
    res.status(status).json({
        message: err.message || 'oops!'
    });
});

module.exports = app;
