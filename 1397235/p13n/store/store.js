/**
 * An abstract key/value datastore implementation for reading/writing analytics data.
 * 
 * @module 
 * @name analytics/store/store.js
 *
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 * 
 */
var redisConnection = require('../../modules/redisConnection');
var redisClient = redisConnection.getRedisClient();
var keyPrefix = "juniper.net.analytics";

/**
 * Helper function to make a key suitable for writing to the datastore.
 * 
 * @param {String} key - The key to be transformed into a key suitable for the datastore.
 */
function makeKey(key) {
    return keyPrefix +  "." + key;
}

/**
 * Set a key/value pair in the datastore.
 *
 * @param {String} key - The key under which to store the datastore value.
 * @param {Object} value - The value to be stored in the datastore.  This value must be JSON-serializable.
 * @param {Function} callback - The callback that will be called if an error occurs.  It takes a single argument
 * that represents a string describing the error.  
 */
exports.set = function(key, value, callback) {
	redisClient.set(makeKey(key), JSON.stringify(value), callback);
}

/**
 * Get the value of a key from the datastore.
 *
 * @param {String} key - The key.
 * @param {Function} callback - The callback that will be called once the value is fetched.  It takes two argauments:
 *   err - The string representing the error, if an error occurs.  Undefined otherwise.
 *   value - The value of the key if no error occurs.
 */
exports.get = function(key, callback) {
	redisClient.get(makeKey(key), function(err, value) {
		var val = value;

		if (!err) {
            val = JSON.parse(value);
		}
		
		callback(err, val);
    });
};
