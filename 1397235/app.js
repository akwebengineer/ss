/**
 * The express/node app server
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

var express = require('express');
var http = require('http');
var path = require('path');
var pubsub = require('./modules/pubsub');
var provider_cache = require('./modules/provider_cache');
var appRouter = require('./modules/appRouter');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var multer = require('multer');
var errorhandler = require('errorhandler');
var config = require('./config');
var app = express();

global.appRoot = path.resolve(__dirname);

app.use(compression());
app.use(cookieParser());

app.engine('html', require('hogan-express'));

var device_port = process.env.DEVICE_PORT || 4730;

// all environments
app.set('port', process.env.PORT || config.app_port || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('docroot', path.join(path.dirname(require.main.filename), "public"));
app.set('plugins_base', "installed_plugins");
app.set('route directory', 'appRoutes');
app.use(favicon(path.join("public", "assets", "images", "favicon.png")));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(require('./modules/asset_rewriter'));

// Development mode configuration params
if (app.get('env') == 'development') {
    console.log('Configuring development mode');
    app.use(express.static(path.join(__dirname, 'public')));
}

// Production mode configuration params
if (app.get('env') == 'production') {
    console.log('Configuring production mode');
    var oneYear = 365*24*60*60*1000;
    // never cache index.html &  installed_plugins.css
    app.use(express.static(path.join(__dirname, 'views', 'index.html'), {maxAge: 0}));
    app.use('/assets/css/plugins', express.static(path.join(__dirname, '/public/assets/css/plugins'), {maxAge: 0}));
    app.use(['/assets/js/widgets/*/tests/*', '/assets/js/widgets/testWidgets.html'], handleWidgetTestPages);
    // cache all other static files
    app.use(express.static(path.join(__dirname, 'public'), {maxAge: oneYear}));
}


/* Log errors on console.
 *
 * @param {object} err - error object to log.
 * @param {object} req - express request object.
 * @param {object} res - express response object.
 * @param {Function} next - next function to call with error.
 */
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

/* Send error to client if request was issued with the "X-Requested-With"
 * header field set to "XMLHttpRequest" (jQuery etc).
 *
 * @param {object} err - error object to log.
 * @param {object} req - express request object.
 * @param {object} res - express response object.
 * @param {Function} next - next function to call with error.
 */
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.send(500, {
            error: 'Something blew up!'
        });
    } else {
        next(err);
    }
}

/* Render error in current view.
 *
 * @param {object} err - error object to log.
 * @param {object} req - express request object.
 * @param {object} res - express response object.
 * @param {Function} next - next function to call with error.
 */
function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', {
        error: err
    });
}

/* Allow access to widget test pages only in debug mode (applicable only in production) 
 *
 * @param {object} req - express request object.
 * @param {object} res - express response object.
 * @param {Function} next - express function for passing control to next middleware.
 */ 
function handleWidgetTestPages(req, res, next) {
    var widgetTestPath = new RegExp("^\/assets\/js\/widgets\/(.*)\/tests\/(.[^/]*).html");
    var widgetsTestPage = "/assets/js/widgets/testWidgets.html";
    if (widgetTestPath.test(req.baseUrl) || widgetsTestPage == req.baseUrl ) {
        if(req.query['debug'] == 'true') {
            next();
        }
        else {
            // 404 error if the query parameter is not set
            res.status(404);
            res.render('index');
        }
    }
    else {
        next();
    }

}

// Initialize the provider_cache
provider_cache.init();

// Routes
require('./routes/appResolver/preferencesResolver')(app, device_port);
require('./routes/plugin')(app);
require('./routes/config')(app);
// load app-defined routes
appRouter.load(app);
require('./routes/index')(app);

if (app.get('env') == 'development') {
    app.use(logErrors);
    app.use(clientErrorHandler);
    app.use(errorHandler);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// Enable development mode
// To enable producttion mode; set the environment variable
//    NODE_ENV => production
app.enable(process.env.NODE_ENV || "development");

var server = http.createServer(app);

// initialize pubsub system
pubsub.init(server);

// Only start if called directly, to facilitate testing
if (!module.parent) {
    server.listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });
}

exports = module.exports = server;

// delegates use() function
exports.use = function() {
  app.use.apply(app, arguments);
};

exports.app = app;
