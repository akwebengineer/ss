/**
 * Defines the HTTP handler for the p13n server.
 * 
 * @module 
 * 
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 * 
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var errorhandler = require('errorhandler');
var provider_cache = require('../../modules/provider_cache');
var whoAmIResolver = require('../../routes/appResolver/whoAmIResolver');
var app = express();
var logger = require('morgan');

provider_cache.init();

app.use(compression());
app.use(cookieParser());

var device_port = 3001;

// all environments
app.set('port', device_port);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(logger('dev'));
app.use('*', whoAmIResolver);

module.exports = app;