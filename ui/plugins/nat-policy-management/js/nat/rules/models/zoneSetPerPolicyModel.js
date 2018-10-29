/**
 * Model for zones
 *
 * @module ZoneModel
 * @author swathin@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
  '../../../../../ui-common/js/models/spaceModel.js',
  '../constants/natRuleGridConstants.js'
], function (SpaceModel, PolicyManagementConstants) {
var ZoneModel = SpaceModel.extend({

        urlRoot: "/api/juniper/sd/policy-management/nat/policies/zones",

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'zones.zone',
             //   accept: NATPolicyManagementConstants.PORT_SETS_CREATE_ACCEPT_HEADER,
                accept: "application/vnd.juniper.sd.policy-management.nat.zones+json;version=1;charset=UTF-8"
            });
        }
    });

  return ZoneModel;
});