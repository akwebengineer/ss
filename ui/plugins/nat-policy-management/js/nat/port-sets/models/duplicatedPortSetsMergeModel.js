/**
 * Model for merging duplicated port sets
 * 
 * @module DuplicatedPortSetsMergeModel
 * @author Damodhar M<mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../../ui-common/js/models/spaceModel.js',
        '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function (SpaceModel,NATPolicyManagementConstants) {

    var DuplicatedPortSetsMergeModel = SpaceModel.extend({
        urlRoot: NATPolicyManagementConstants.PORT_SETS_DUPLICATE_MERGE_URL,
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                accept: NATPolicyManagementConstants.PORT_SETS_DUPLICATE_MERGE_ACCEPT_HEADER,
                contentType: NATPolicyManagementConstants.PORT_SETS_DUPLICATE_MERGE_CONTENT_HEADER
            });
        }
    });
    return DuplicatedPortSetsMergeModel;
});

