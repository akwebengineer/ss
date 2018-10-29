/** 
 * A module to get the username from session.
 * 
 * @module 
 * @name appProvider/whoAmIProvider
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

// This module is for testing Preference API. In production, it will be provided by app.
var whoAmIProvider = function WhoAmIProvider(req, res, next) {
	
	var http = require('https');
	var request = require('request');
	var sessionCookie = req.headers.cookie;
	
	if(sessionCookie != 'badCookie')
		res.locals.username = "testUser";

	next();
	
		
};

module.exports = whoAmIProvider;