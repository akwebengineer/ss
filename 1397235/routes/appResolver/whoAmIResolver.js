/** 
 * A Slipstream's resolver module that defines the interface between Express route and whoAmIProvider middleware (provided/installed by app).
 * 
 * @module 
 * @name routes/appResolver/whoAmIResolver
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

var provider_cache = require('../../modules/provider_cache').provider_cache;

/**
 * Function to provide username from session/token (based on the authentication mechanism)
 *
 * @param {Object} req - The request
 * @param {Object} res - The response                           
 * @param {Function} next - The function to pass the execution control to next middleware
 * 
 */
var whoAmIResolver = function(req, res, next) {
	// Get the provider from cache.
	var whoAmIProvider = provider_cache.whoAmIProvider;
	
	// If the provider is available, pass req, res and next parameters to the provider.
	if(whoAmIProvider) {
		whoAmIProvider(req, res, next);
	}

	// If there is no provider available, pass the control to the next middleware.
	else {
		next();
	}

}

module.exports = whoAmIResolver;

