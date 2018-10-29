/**
 * Model for getting routing instances
 *
 * @module Devices Model
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/spaceModel.js'
], function (SpaceModel) {

    var RoutingModel = SpaceModel.extend({
        defaults: {
            "definition-type":  "CUSTOM"
        },
        urlRoot: '/api/juniper/sd/device-management/devices/{id}/routing-instances',
       // idAttribute: "id",
        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {

                "accept": "application/vnd.juniper.sd.device-management.routing-instances+json;q=0.01;version=1",
                "contentType": "application/vnd.juniper.sd.device-management.routing-instances+json;version=1;charset=UTF-8",
                "jsonRoot": "routing-instances"
            });
        }

    });

    return RoutingModel;
});
