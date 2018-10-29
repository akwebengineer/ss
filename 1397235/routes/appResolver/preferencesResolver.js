/**
 * A module that implements the preferences API for the slipstream server.
 * @module preferences
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
var preferences = function preferences(app, device_port) {

    var sessionKey = 'api.sid';
    var testSessionKey = 'test-key'
    var http = require('https');
    var request = require('request');
    var querystring = require('querystring');
    var provider_cache = require('../../modules/provider_cache').provider_cache;
    var whoAmIResolver = require('./whoAmIResolver');
    var content_type_json = 'application/json; charset=utf-8';
    var preferencesProvider = provider_cache.preferencesProvider && typeof provider_cache.preferencesProvider === "function" && new provider_cache.preferencesProvider();

    /**
     * Internal function to set 200 as status code with reply.
     * @param {Object} res - The response object
     * @param {Object} reply - The return data
     * @private
     */
    var _200status = function (res, reply) {
        res.status(200);
        res.setHeader('Content-Type', content_type_json);
        return res.send(reply);
    };

    /**
     * Internal function to set 500 as status code with reply.
     * @param {Object} res - The response object
     * @param {Object} reply - The return data
     * @private
     */
    var _500status = function (res, reply) {
        res.status(500);
        res.setHeader('Content-Type', content_type_json);
        return res.send(reply);
    };

    /**
     * Callback to be invoked when data operation is successful.
     * @param {res} res - response object.
     * @returns {function} done callback function.
     */
    var done = function (res) {
        return function (reply) {
            _200status(res, reply);
        }
    };

    /**
     * Callback to be invoked when data operation fails.
     * @param {res} res - response object.
     * @returns {function} fail callback function.
     */
    var fail = function (res) {
        return function (reply) {
            _500status(res, reply);
        }
    };

    /**
     * Get User Preference API Handler.  This method gets the user record associated
     *    with the logged in user.
     *
     * @param {Object) req - The request object.
     * @param {Object} res - The response object
     */
    var getUserPreferences = function (req, res) {
        if (!res.locals.username) {
            res.status(401);
            res.setHeader('Content-Type', content_type_json);
            return res.send(JSON.stringify({
                status: 'Error - Need to be authenticated to perform this operation'
            }));
        } else {
            preferencesProvider.getUserPreferences && typeof preferencesProvider.getUserPreferences === "function" && preferencesProvider.getUserPreferences(res.locals.username, done(res), fail(res));
        }
    };

    /**
     * Put User Preference API Handler.  This method updates the preferences for
     *  the logged in user.
     *
     * @param {Object) req - The request object.
     * @param {Object} res - The response object
     */
    var putUserPreferences = function (req, res) {
        if (!res.locals.username) {
            res.status(401);
            res.setHeader('Content-Type', content_type_json);
            return res.send(JSON.stringify({
                status: 'Error - Need to be authenticated to perform this operation'
            }));
        } else {
            preferencesProvider.putUserPreferences && typeof preferencesProvider.putUserPreferences === "function" && preferencesProvider.putUserPreferences(res.locals.username, req.body, done(res), fail(res));
        }
    };

    /**
     * Delete User Preference API Handler.  This method deletes the user record associated
     *    with the logged in user.
     *
     * @param {Object) req - The request object.
     * @param {Object} res - The response object
     */
    var deleteUserPreferences = function (req, res) {
        if (!res.locals.username) {
            res.status(401);
            res.setHeader('Content-Type', content_type_json);
            return res.send(JSON.stringify({
                status: 'Error - Need to be authenticated to perform this operation'
            }));
        } else {
            preferencesProvider.deleteUserPreferences && typeof preferencesProvider.deleteUserPreferences === "function" && preferencesProvider.deleteUserPreferences(res.locals.username, done(res), fail(res));
        }
    };

    /**
     * Post to the user preferences API. Fail
     *
     * @param {object} req - The express request object
     * @param {object} res - The express response object
     * @returns {function} function that sends JSON error response
     */
    var postUserPreferences = function (req, res) {
        res.status(403);
        res.setHeader('Content-Type', content_type_json);
        return res.send(JSON.stringify({
            status: 'Error - POST not allowed. Use PUT to update/create user preferences.'
        }));
    };


    /**
     * Get Session Preference API Handler.  This method gets the session record associated
     *    with the session key.
     *
     * @param {Object) url - The request object.
     * @param {Object} res - The response object
     */
    var getSessionPreferences = function (req, res) {
        var sessionToken = req.cookies[sessionKey];
        if (sessionToken) {
            preferencesProvider.getSessionPreferences && typeof preferencesProvider.getSessionPreferences === "function" && preferencesProvider.getSessionPreferences(sessionToken, done(res), fail(res));
        } else {
            res.status(401);
            res.setHeader('Content-Type', content_type_json);
            return res.send(JSON.stringify({
                status: 'Error - Need to be authenticated to perform this operation'
            }));
        }
    };

    /**
     * Put Session Preference API Handler.  This method updates the session record associated
     *    with the session key given an object to update.
     *
     * @param {Object) url - The request object.
     * @param {Object} res - The response object
     */
    var putSessionPreferences = function (req, res) {
        var sessionToken = req.cookies[sessionKey];
        if (sessionToken) {
            preferencesProvider.putSessionPreferences && typeof preferencesProvider.putSessionPreferences === "function" && preferencesProvider.putSessionPreferences(sessionToken, req.body, done(res), fail(res));
        } else {
            res.status(401);
            res.setHeader('Content-Type', content_type_json);
            return res.send(JSON.stringify({
                status: 'Error - Need to be authenticated to perform this operation'
            }));
        }
    };

    /**
     * Delete Session Preference API Handler.  This method deletes the session record associated
     *    with the session key.
     *
     * @param {Object) url - The request object.
     * @param {Object} res - The response object
     */
    var deleteSessionPreferences = function (req, res) {
        var sessionToken = req.cookies[sessionKey];
        if (sessionToken) {
            preferencesProvider.deleteSessionPreferences && typeof preferencesProvider.deleteSessionPreferences === "function" && preferencesProvider.deleteSessionPreferences(sessionToken, done(res), fail(res));
        } else {
            res.status(401);
            res.setHeader('Content-Type', content_type_json);
            return res.send(JSON.stringify({
                status: 'Error - Need to be authenticated to perform this operation'
            }));
        }
    };

    /**
     * Post to the session preferences API. Fail
     *
     * @param {object} req - The express request object
     * @param {object} res - The express response object
     * @returns {function} function that sends JSON error response
     */
    var postSessionPreferences = function (req, res) {
        res.status(403);
        res.setHeader('Content-Type', content_type_json);
        return res.send(JSON.stringify({
            status: 'Error - POST not allowed. Use PUT to update/create session preferences.'
        }));
    };


    app.use('/slipstream/preferences/user', whoAmIResolver);

    // User preferences API
    app.get('/slipstream/preferences/user', getUserPreferences);
    app.put('/slipstream/preferences/user', putUserPreferences);
    app.delete('/slipstream/preferences/user', deleteUserPreferences);
    app.post('/slipstream/preferences/user', postUserPreferences);


    // Session preferences API
    app.get('/slipstream/preferences/session', getSessionPreferences);
    app.put('/slipstream/preferences/session', putSessionPreferences);
    app.delete('/slipstream/preferences/session', deleteSessionPreferences);
    app.post('/slipstream/preferences/session', postSessionPreferences);
};

module.exports = preferences;