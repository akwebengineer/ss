/**
 * A module that implements the default provider for preferences.
 * @module preferencesProvider
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
var preferencesProvider = function PreferencesProvider() {
    var redisConnection = require('../modules/redisConnection');
    var redisClient = redisConnection.getRedisClient();

    /**
     * Get User Preference API Handler.  This method gets the user record associated
     * with the logged in user.
     *
     * @param {String} username - username
     * @param {Function} done - Callback function to invoke when data operation is successful
     * @param {Function} fail - Callback function to invoke when data operation is not successful
     */
    this.getUserPreferences = function (username, done, fail) {
        redisClient.get(username, function (err, reply) {
            if (err) {
                fail(JSON.stringify({
                    status: 'Error - Internal DB error ' + err.toString()
                }));
            } else {
                if (reply == null) {
                    done(JSON.stringify({}));
                } else {
                    done(reply);
                }
            }
        });
    };

    /**
     * Put User Preference API Handler.  This method updates the preferences for
     * the logged in user.
     *
     * @param {String} username - username
     * @param {Object} body - sent data to be processed.
     * @param {Function} done - Callback function to invoke when data operation is successful
     * @param {Function} fail - Callback function to invoke when data operation is not successful
     */
    this.putUserPreferences = function (username, body, done, fail) {
        redisClient.set(username, JSON.stringify(body), function (err) {
            if (err) {
                fail(JSON.stringify({
                    status: 'Error - Internal DB error ' + err.toString()
                }))
            } else {
                done(JSON.stringify({
                    status: 'Success - Updated preferences for user'
                }));
            }
        });
    };

    /**
     * Delete User Preference API Handler.  This method deletes the user record associated
     * with the logged in user.
     *
     * @param {String} username - username
     * @param {Function} done - Callback function to invoke when data operation is successful
     * @param {Function} fail - Callback function to invoke when data operation is not successful
     */
    this.deleteUserPreferences = function (username, done, fail) {
        redisClient.del(username, function (err) {
            if (err) {
                fail(JSON.stringify({
                    status: 'Error - Internal DB error ' + err.toString()
                }));
            } else {
                done(JSON.stringify({
                    status: 'Success - Deleted preferences for user'
                }));
            }
        });
    };

    /**
     * Get Session Preference API Handler.  This method gets the session record associated
     * with the session key.
     *
     * @param {String} sessionToken - sessionToken
     * @param {Function} done - Callback function to invoke when data operation is successful
     * @param {Function} fail - Callback function to invoke when data operation is not successful
     */
    this.getSessionPreferences = function (sessionToken, done, fail) {
        redisClient.get(sessionToken, function (err, reply) {
            if (err) {
                fail(JSON.stringify({
                    status: 'Error - Internal DB error ' + err.toString()
                }));
            } else {
                if (reply == null) {
                    done(JSON.stringify({}));
                } else {
                    done(reply);
                }
            }
        });
    };

    /**
     * Put Session Preference API Handler.  This method updates the session record associated
     * with the session key given an object to update.
     *
     * @param {String} sessionToken - sessionToken
     * @param {Object} body - sent data to be processed.
     * @param {Function} done - Callback function to invoke when data operation is successful
     * @param {Function} fail - Callback function to invoke when data operation is not successful
     */
    this.putSessionPreferences = function (sessionToken, body, done, fail) {
        redisClient.set(sessionToken, JSON.stringify(body), function (err) {
            if (err) {
                fail(JSON.stringify({
                    status: 'Error - Internal DB error ' + err.toString()
                }));
            } else {
                done(JSON.stringify({
                    status: 'Success - Updated preferences for session'
                }));
            }
        });
    };

    /**
     * Delete Session Preference API Handler.  This method deletes the session record associated
     * with the session key.
     *
     * @param {String} sessionToken - sessionToken
     * @param {Function} done - Callback function to invoke when data operation is successful
     * @param {Function} fail - Callback function to invoke when data operation is not successful
     */
    this.deleteSessionPreferences = function (sessionToken, done, fail) {
        redisClient.del(sessionToken, function (err) {
            if (err) {
                fail(JSON.stringify({
                    status: 'Error - Internal DB error ' + err.toString()
                }));
            } else {
                done(JSON.stringify({
                    status: 'Success - Deleted preferences for session'
                }));
            }
        });
    };

};

module.exports = preferencesProvider;