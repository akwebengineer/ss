/**
 * A Backbone model representing utm-policy (/api/juniper/sd/utm-management/utm-policies).
 *
 * @module UTMPolicyModel
 * @author Pei-Yu Yang <pyang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {
    /**
     * UTMPolicyModel definition.
     */
    var UTMPolicyModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/utm-management/utm-policies',

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'utm-policy',
                accept: 'application/vnd.juniper.sd.utm-management.utm-policy+json;version=1',
                contentType: 'application/vnd.juniper.sd.utm-management.utm-policy+json;version=1;charset=UTF-8'
            });
        }
    });

    return UTMPolicyModel;
});