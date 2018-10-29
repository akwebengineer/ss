/**
 * Model for getting or updating a specific Device
 * 
 * @module DeviceModel
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var DeviceModel = SpaceModel.extend({

            // for add device CREATE.  The other url and headers are for get device GET.  Need to put this in sync method
            // URL :   /api/juniper/sd/device-management/item-selector/{store-id}
            // HTTP method : POST
            // Content-Type : application/vnd.juniper.sd .device-management.item-selector.select-devices+json;version=1;charset=UTF-8

        urlRoot : '/api/juniper/sd/policy-management/firewall/policies/',

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'device',
                accept: 'application/vnd.juniper.sd.policy-management.devices+json;version=2;q=0.02'
             //   contentType: 'application/vnd.juniper.sd.firewall-policies.src-identity+json;version=1;charset=UTF-8'
            });
        }
    });

    return DeviceModel;
});