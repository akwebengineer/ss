/**
 * Model for merging duplicated nat pools
 * 
 * @module DuplicatedNATPoolsMergeModel
 * @author Damodhar M<mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function (SpaceModel,NATPolicyManagementConstants) {
    var DuplicatedNATPoolsMergeModel = SpaceModel.extend({
        urlRoot: NATPolicyManagementConstants.NAT_POOLS_DUPLICATE_MERGE_URL,
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                accept:NATPolicyManagementConstants.NAT_POOLS_DUPLICATE_MERGE_ACCEPT_HEADER,
                contentType: NATPolicyManagementConstants.NAT_POOLS_DUPLICATE_MERGE_CONTENT_HEADER
            });
        }
    });

    return DuplicatedNATPoolsMergeModel;
});
