/**
 * A Backbone model representing utm-policy collection (/api/juniper/sd/utm-management/utm-policies).
 *
 * @module UTMPolicyCollection
 * @author Pei-Yu Yang <pyang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './utmPolicyModel.js'
], function (
    SpaceCollection,
    UTMPolicyModel
) {
    /** 
     * UTMPolicyCollection definition.
     */
    var UTMPolicyCollection = SpaceCollection.extend({
        url: '/api/juniper/sd/utm-management/utm-policies',
        model: UTMPolicyModel,

        /** 
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'utm-policies.utm-policy',
                accept: 'application/vnd.juniper.sd.utm-management.utm-policy-refs+json;version=1'
            });
        }
    });

    return UTMPolicyCollection;
});
