define([
  '../../rules/constants/natRuleGridConstants.js'
], function(FWRuleGridConstants){

  var NATPolicyDeviceConstants = $.extend({
    POLICY_URL: "/api/juniper/sd/policy-management/nat/devices/",
    DEVICES_URL : "/api/juniper/sd/policy-management/nat/devices",
    DEVICES_MEDIATYPE : "application/vnd.juniper.sd.policy-management.nat.devices+json;version=3;q=0.03",
    ACCEPT_HEADER: "Accept"
  }, FWRuleGridConstants);

  //TODO - Overriding extended value for now, as POLICY_URL is getting set to old value.
  NATPolicyDeviceConstants.POLICY_URL = "/api/juniper/sd/policy-management/nat/devices/";

  return NATPolicyDeviceConstants;

});