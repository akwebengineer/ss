/**
 * A Backbone model representing port-sets (/api/juniper/sd/portset-management/port-sets/).
 *
 * @module PortSetsModel
 * @author Sandhya <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function (SpaceModel, NATPolicyManagementConstants) {
    /**
     * PortSetsModel definition.
     */
    var PortSetsModel = SpaceModel.extend({

        urlRoot: NATPolicyManagementConstants.PORT_SETS_URL,

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'port-set',
                accept: NATPolicyManagementConstants.PORT_SETS_CREATE_ACCEPT_HEADER,
                contentType: NATPolicyManagementConstants.PORT_SETS_CONTENT_HEADER
            });
        }
    });

    return PortSetsModel;
});