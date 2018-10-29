/** 
 * This module contains a set of common utility methods useful 
 * throughout the framework.
 *
 * @module 
 * @name utils
 * @author Andrew Chasin <achasin@juniper.net>
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(function() {
	return {
		/**
         * Compute a hash code
         * @param {string} - The string on which the hash should be computed.
         * @returns The cmomputed hash code.
         */
        hash_code: function(s) {
            var hash = 0,
                strlen = s.length,
                i, c;
            if (strlen === 0) {
                return hash;
            }
            for (i = 0; i < strlen; i++) {
                c = s.charCodeAt(i);
                hash = ((hash << 5) - hash) + c;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        },

        /**
         * Clone an object's "own" properties into another
         * @param {object} - The object to be cloned
         * @returns The cloned object
         */
        clone: function(source) {
            if (source == null) {
                return null;
            } else if (source == {}) {
                return {};
            }

            var destination = {};

            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    destination[key] = source[key];    
                }
            }

            return destination;
        },
        /**
         * Ccompare two software version strings of the form n_1.n_2.n_3...n_m
         * where n_i is an integer.  eg. "2.5.12"
         *
         * @param {String} v1 - The first version string to be compared
         * @param {String} v2 - The second version string to be compared.
         *
         * @returns > 0 if version v1 > v2, < 0 if version v1 < v2, 0 if v1 == v2.
         */
        version_compare: function(v1, v2) {
            v1 = v1.split('.');
            v2 = v2.split('.');

            while (v1.length && v2.length) {
                if (v1[0] != v2[0]) {
                    return v1[0] - v2[0];
                }
                v1.shift();
                v2.shift();        
            }
            return v1.length - v2.length;
        },

        /**
         * Check that the current user has a set of capabilities
         *
         * @param {Array<Object|Array>} requiredCapabilities - An array of capabilities to be checked.
         * When it is an array of objects, each member of the array is an object with a 'name' property that contains the name of a capability.
         * When it is an array of multiple sets of objects, it implies a logical 'or' operator between each set 
         *
         * @returns true if the current user has the given set of capabilities, false otherwise.
         */
        userHasCapabilities: function(requiredCapabilities) {
            var rbac_resolver = new Slipstream.SDK.RBACResolver();

            var capabilities = requiredCapabilities.map(function(capabilities) {
                if(_.isArray(capabilities)){
                    var multiset_capabilities = function(capability){
                        return capability.name;
                    }
                    return capabilities.map(multiset_capabilities);
                }else{
                    return capabilities.name;
                }
            });

            return rbac_resolver.verifyAccess(capabilities);
        },

        /**
         * Truncate a label with ellipsis
         *
         * @param {String} label - Original label string
         * @param {Number} maxLabelSize - The size at which the label will be truncated
         * @param {String} position - The position ("center" or "end") at which the label will be truncated, default is "end"
         *
         * @returns If string exceeds maxLabelSize, return the truncated label with ellipsis; otherwise return the original label
         */
        truncateLabelWithEllipsis: function(label, maxLabelSize, position) {
            var ellipsisStr = '...';
            var formattedLabel = label;
            var truncatePosition = (position && position == "center") ? "center" : "end";

            if (label && maxLabelSize) {
                if (truncatePosition == "end") {
                    formattedLabel = label.length > (maxLabelSize + ellipsisStr.length) ? label.substring(0, maxLabelSize) + ellipsisStr : label;
                } else {
                    formattedLabel = label.length > (maxLabelSize + ellipsisStr.length) ? label.substring(0, maxLabelSize/2) + ellipsisStr + label.substr(label.length-maxLabelSize/2, label.length): label;
                }
            }
            return formattedLabel;
        }
	};
});