/**
 * A Backbone model representing user firewall management access profile.
 *
 * @module Access Profile Model
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../../constants/userFirewallConstants.js'
], function(
    SpaceModel,
    UserFirewallConstants
    ) {
    /**
     * AccessProfileModel definition.
     */
    var AccessProfileModel = SpaceModel.extend({

        urlRoot: UserFirewallConstants.ACCESS_PROFILE.URL_PATH,

        initialize: function() {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: UserFirewallConstants.ACCESS_PROFILE.JSON_ROOT2,
                accept: UserFirewallConstants.ACCESS_PROFILE.ACCEPT_HEADER,
                contentType: UserFirewallConstants.ACCESS_PROFILE.CONTENT_TYPE
            });
        }
    });

    return AccessProfileModel;
});