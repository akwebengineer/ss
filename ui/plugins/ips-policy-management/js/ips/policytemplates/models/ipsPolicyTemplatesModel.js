/**
 * @module IpsPolicyTemplatesModel
 * @author Ashish Vyawahare <avyaw@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../constants/ipsPolicyTemplatesConstants.js'
], function (SpaceModel, IpsPolicyTemplatesConstants) {
    /**
     * IpsPolicyTemplate definition.
     */
    var IpsPolicyTemplatesModel = SpaceModel.extend({

        urlRoot: IpsPolicyTemplatesConstants.IPS_POLICY_TEMPLATE_URL,

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'policy-template',
                accept: IpsPolicyTemplatesConstants.IPS_POLICY_TEMPLATE_ACCEPT_HEADER,
                contentType: IpsPolicyTemplatesConstants.IPS_POLICY_TEMPLATE_CONTENT_TYPE
            });
        }
    });

    return IpsPolicyTemplatesModel;
});