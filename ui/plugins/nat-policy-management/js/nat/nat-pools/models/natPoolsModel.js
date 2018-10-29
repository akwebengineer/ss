/**
 * A module that works with nat-pools.
 *
 * @module NatpoolsModel
 * @author Damodhar <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
     '../../../../../ui-common/js/models/spaceModel.js',
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function (SpaceModel, NATPolicyManagementConstants) {
    /**
     * natpoolsModel definition.
     */
    var natpoolsModel = SpaceModel.extend({

        urlRoot: NATPolicyManagementConstants.NAT_POOLS_URL,

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'nat-pool',
                accept: NATPolicyManagementConstants.NAT_POOLS_CREATE_ACCEPT_HEADER,
                contentType: NATPolicyManagementConstants.NAT_POOLS_CONTENT_HEADER
            });
        }
    });

    return natpoolsModel;
});