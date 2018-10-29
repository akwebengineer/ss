define([
  '../../rules/constants/ipsRuleGridConstants.js'
], function(FWRuleGridConstants){

  var IPSPolicyDeviceConstants = $.extend({
    POLICY_URL: "/api/juniper/sd/policy-management/ips/devices/",
    DEVICES_URL : "/api/juniper/sd/policy-management/ips/devices",
    DEVICES_MEDIATYPE : "application/vnd.juniper.sd.policy-management.ips.devices+json;version=3;q=0.03",
    ACCEPT_HEADER: "Accept"
  }, FWRuleGridConstants);

  //TODO - Overriding extended value for now, as POLICY_URL is getting set to old value.
  IPSPolicyDeviceConstants.POLICY_URL = "/api/juniper/sd/policy-management/ips/devices/";

  return IPSPolicyDeviceConstants;

});