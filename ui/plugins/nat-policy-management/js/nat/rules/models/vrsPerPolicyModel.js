/**
 * Model for virtual routers
 *
 * @module VRModel
 * @author swathin@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
  '../../../../../ui-common/js/models/spaceModel.js',
  '../constants/natRuleGridConstants.js'
], function (SpaceModel, PolicyManagementConstants) {
var VRModel = SpaceModel.extend({

        urlRoot: "/api/juniper/sd/policy-management/nat/policies/virtual-routers",

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'virtual-routers.virtual-router',
                accept: "application/vnd.juniper.sd.policy-management.nat.virtual-routers+json;version=1;charset=UTF-8"
            });
        }
    });

  return VRModel;
});