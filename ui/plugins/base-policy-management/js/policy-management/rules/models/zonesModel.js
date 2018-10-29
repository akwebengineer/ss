/**
 * Model for getting addresses
 * 
 * @module ZonesModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../../../../../fw-policy-management/js/firewall/rules/constants/fwRuleGridConstants.js'
], function (SpaceModel, PolicyManagementConstants) {

    var ZonesModel = SpaceModel.extend({
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": PolicyManagementConstants.RULE_ACCEPT_HEADER,
                "contentType": PolicyManagementConstants.RULE_CONTENT_HEADER,
                "jsonRoot": "zone"
            });
        }
    });

    return ZonesModel;
});