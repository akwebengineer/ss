/**
 * A module that get rbac status and return the rbac hash table
 *
 * @module gridRBAC
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([], function(){
    var GridRBAC = function(conf) {
        /**
         * gridRBAC constructor
         *
         * @constructor
         * @class gridRBAC - return rbac hash table
         *
         * @param {Object} conf - User configuration object
         * @returns {Object} Current gridRBAC's object: this
         */
        
        /**
         * Initialize gridRBAC
         * @return {Object} rbacHash
         */
        this.init = function(){
            return buildRbacHash();
        };

        /**
         * Cache rbac status
         * @inner
         */
        var buildRbacHash = function() {
            var rbacHash = {};

            if (Slipstream && Slipstream.SDK && Slipstream.SDK.RBACResolver) {
                var rbacResolver = new Slipstream.SDK.RBACResolver();

                if (conf.actionEvents) {
                    $.each(conf.actionEvents, function (key, value) {
                        if (_.isObject(value)) {
                            rbacHash[key] = value.capabilities ? rbacResolver.verifyAccess(value.capabilities) : true;
                        }
                    });
                }
            } else {
                if (conf.rbacData) rbacHash = conf.rbacData;
            }
            return rbacHash;
        };
    };

    return GridRBAC;
});
