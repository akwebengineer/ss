/**
 * Model for address replace
 * 
 * @module NatPoolsReplaceModel
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function (SpaceModel,NATPolicyManagementConstants) {

    var NatPoolsReplaceModel = SpaceModel.extend({
        urlRoot: NATPolicyManagementConstants.NAT_POOLS_REPLACE_URL,
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                "accept": NATPolicyManagementConstants.NAT_POOLS_REPLACE_ACCEPT_HEADER,
                "contentType": NATPolicyManagementConstants.NAT_POOLS_REPLACE_CONTENT_HEADER
            });
        }
    });

    return NatPoolsReplaceModel;
});