/**
 * A Backbone model representing app-firewall collection 
 *
 * @module AppFireWallCollection
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/models/spaceCollection.js',
    '../../application-security/model/AppSecureModel.js'
], function (
    SpaceCollection,
    AppFirewallModel
) {
    /** 
     * AppFireWallCollection definition.
     */
    var AppFireWallCollection = SpaceCollection.extend({
        url: '/api/juniper/sd/policy-management/firewall/app-fw-policy-management/app-fw-policies',
        model: AppFirewallModel,

        /** 
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'app-fw-policies.app-fw-policy',
                accept: 'application/vnd.juniper.sd.app-fw-policy-management.app-fw-policies+json;version=1;q=0.01'
            });
        }
    });

    return AppFireWallCollection;
});