/**
 * A Backbone model representing secintel-policy collection (/api/juniper/sd/secintel-management/secintel-policies).
 *
 * @module SecIntelPolicyCollection
 * @author Pei-Yu Yang <pyang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceCollection.js',
    './secIntelPolicyModel.js'
], function (
    SpaceCollection,
    SecIntelPolicyModel
) {
    /** 
     * SecIntelPolicyCollection definition.
     */
    var SecIntelPolicyCollection = SpaceCollection.extend({
        url: function(filter) {
            var baseUrl = "/api/juniper/sd/secintel-management/secintel-policies";

            if (filter) {
                return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }
            return baseUrl;
        },
        model: SecIntelPolicyModel,

        /** 
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'secintel-policies.secintel-policy',
                accept: 'application/vnd.juniper.sd.secintel-management.secintel-policies+json;version=1'
            });
        }
    });

    return SecIntelPolicyCollection;
});
