/** 
 * A module that implements a Slipstream RBAC Provider that
 * uses the Space RBAC service.
 *
 * @module Slipstream/RBACProvider
 * @copyright Juniper Networks, Inc. 2015
 */
define(['./domainProvider.js'], function(DomainProvider) {
    var capabilities_cache;
    var userid;
    var ALL_ACCESS_CAPABILITY = 'SuperCop';

    function RBACProvider() {
        Slipstream.SDK.RBACProvider.call(this);	
    }

    RBACProvider.prototype = Object.create(Slipstream.SDK.RBACProvider.prototype);
    RBACProvider.prototype.constructor = RBACProvider;

    RBACProvider.prototype.init = function(options) {
        options = options || {};

        if (!options.userid) {
        	  if (options.fail) {
                options.fail("A userid must be provided");
            }
            return;
        }

        if ((options.userid != userid) && capabilities_cache) {
        	  capabilities_cache.empty();
        }

    	  userid = options.userid;

        capabilities_cache = new CapabilitiesCache();

        capabilities_cache.load(userid, {
        	success: function() {
        		if (options.success) {
        			options.success();
        		}
        	},
        	fail: function(errorMsg) {
        		if (options.fail) {
        			options.fail(errorMsg);
        		}
        	}
        });
        //initialize the domain caches
        new DomainProvider().initiateDomainCache();
    }

    /**
     * Verify that a user has a set of capabilities
     *
     * @param {Array<String>} capabilities - An array of capability names to be verified.
     * @returns - true if the authenticated user has the given set of capabilities, false otherwise.
     */
    RBACProvider.prototype.verifyAccess = function(capabilities) {
        if (capabilities_cache.contains([ALL_ACCESS_CAPABILITY])) {
            // user has all capabilities
            return true;
        }

        return capabilities_cache.contains(capabilities);
    }

    function CapabilitiesCache() {
         var cache = {};
      	 var USER_URL = '/api/space/user-management/users';
         var USER_CAPABILITIES_ACCEPT = 'application/vnd.net.juniper.space.user-management.capabilities+json;version=3;';

         this.load = function(userid, options) {
              // Fetch the user's capabilities
              var capabilities_url = USER_URL + '/' + userid + '/capabilities';

           	  $.ajax({
    		          url: capabilities_url,
    		          headers: {
    		              Accept: USER_CAPABILITIES_ACCEPT
    		          }
              }).done(function(capabilities_info) {
                  var capabilities = capabilities_info.capabilities.capability;

                  if(!capabilities){
                      capabilities = [];
                  }
                  
                  if (!(capabilities instanceof Array)) {
                      capabilities = [capabilities];
                  }

                  // add the user's capabilities to the cache
                  $.each(capabilities, function(capIndex, capability) {
                      cache[capability.name] = true;
                  })

                  if (options.success) {
                      options.success();
                  }
              }).fail(function() {
                  if (options.fail) {
                      options.fail("Failed to prime capabilities cache");
                  }  
              });
         }

         /**
          * Empty the cache.
          */
         this.empty = function() {
            cache = {};
         }

         /**
          * Check if the cache contains a set of capabilities
          *
          * @param {Array<String>} capabilties - An array of capability names to be checked
          * @returns - true if the cache contains the given set of capabilities, false otherwise.
          */
         this.contains = function(capabilities) {
            for (var i = 0; i < capabilities.length; i++) {
                if (!cache[capabilities[i]]) {
                    return false;
                } 
            } 
            return true;
         }

         /**
          * Check if the cache is empty
          *
          * @returns true if the cache is empty, false otherwise.
          */
         this.isEmpty = function() {
             return !Object.keys(cache).length;
         }
    }

    return RBACProvider;
});