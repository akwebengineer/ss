/**
 * A Backbone model representing Active Directory collection
 *
 * @module ActiveDirectoryCollection
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    '../../../../../ui-common/js/models/spaceCollection.js',
    './activeDirectoryModel.js',
    '../../constants/userFirewallConstants.js'
], function (SpaceCollection, Model, UserFirewallConstants) {
    /**
     * Active Directory Collection definition.
     */
    var ActiveDirectoryCollection = SpaceCollection.extend({
        url: function (filter) {
            var baseUrl = UserFirewallConstants.ACTIVE_DIRECTORY.URL_PATH;

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },
        model: Model,


        /**
         * initialize the collection
         */
        initialize: function () {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: UserFirewallConstants.ACTIVE_DIRECTORY.GRID_JSON_ROOT,
                accept: UserFirewallConstants.ACTIVE_DIRECTORY.ACCEPT_HEADER
            });
        }
    });

    return ActiveDirectoryCollection;
});