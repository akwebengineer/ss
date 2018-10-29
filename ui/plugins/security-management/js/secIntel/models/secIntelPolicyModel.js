/**
 * A Backbone model representing secintel-policy (/api/juniper/sd/secintel-management/secintel-policies).
 *
 * @module SecIntelPolicyModel
 * @author Pei-Yu Yang <pyang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {
    /**
     * SecIntelPolicyModel definition.
     */
    var SecIntelPolicyModel = SpaceModel.extend({

        urlRoot: '/api/juniper/sd/secintel-management/secintel-policies',

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'secintel-policy',
                accept: 'application/vnd.juniper.sd.secintel-management.secintel-policy+json;version=1',
                contentType: 'application/vnd.juniper.sd.secintel-management.secintel-policy+json;version=1;charset=UTF-8'
            });
        }
    });

    return SecIntelPolicyModel;
});