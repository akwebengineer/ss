/** 
 * A module for initiating the connection with Redis datastore.
 * @module redisConnection
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

var redis = require('redis');
var RedisClustr = require('redis-clustr');
var settings = require('../config');
var clusterMode = settings.redis_cluster !== undefined;
var redisClient;

/**
 * Create a connection with Redis datastore.
 */
var createConnection = function () {
	if(clusterMode) {
		var clusterConfig = settings.redis_cluster;
		clusterConfig.createClient =  function(port, host) {
			return redis.createClient(port, host);
		};
		redisClient = new RedisClustr(clusterConfig);
	} else {
		redisClient = redis.createClient(settings.redis_port, settings.redis_host);
	}

	redisClient.on('error', function(err) {
		console.log('Error ' + err);
	});
};


/**
 *  Get cached redisClient object 
 */
var getRedisClient = function() {

	if(!redisClient) {
		createConnection();
	}
	
	return redisClient;
}

exports.getRedisClient = getRedisClient;
