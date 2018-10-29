/**
 * Model for interfaces
 *
 * @module InterfaceModel
 * @author swathin@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
  '../../../../../ui-common/js/models/spaceModel.js',
  '../constants/natRuleGridConstants.js'
], function (SpaceModel, PolicyManagementConstants) {
var InterfaceModel = SpaceModel.extend({

        urlRoot: "/api/juniper/sd/policy-management/nat/policies/interfaces",

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'interfaces.interface',
                accept: "application/vnd.juniper.sd.policy-management.nat.interfaces+json;version=1;charset=UTF-8"
            });
        }
    });

  return InterfaceModel;
});