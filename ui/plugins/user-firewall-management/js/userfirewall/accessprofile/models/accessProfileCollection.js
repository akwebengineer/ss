/**
 * A Backbone model representing Access Profile collection
 *
 * @module AccessProfileCollection
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    '../../../../../ui-common/js/models/spaceCollection.js',
    './accessProfileModel.js',
    '../../constants/userFirewallConstants.js'
], function (
    SpaceCollection,
    AccessProfileModel,
    UserFirewallConstants
    ) {
    /**
     * AccessProfileCollection definition.
     */
    var AccessProfileCollection = SpaceCollection.extend({
        url: function(filter) {
            var baseUrl = UserFirewallConstants.ACCESS_PROFILE.URL_PATH;

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },
        model: AccessProfileModel,

        /**
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */

        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: UserFirewallConstants.ACCESS_PROFILE.JSON_ROOT,
                accept: UserFirewallConstants.ACCESS_PROFILE.ACCEPT
            });
        }
    });

    return AccessProfileCollection;
});