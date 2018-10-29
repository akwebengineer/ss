define([
  '../../rules/constants/fwRuleGridConstants.js'
], function(FWRuleGridConstants){

  var FirewallPolicyDeviceConstants = $.extend({
    POLICY_URL: "/api/juniper/sd/policy-management/firewall/devices/",
    DEVICES_URL : "/api/juniper/sd/policy-management/firewall/devices",
    DEVICES_MEDIATYPE : "application/vnd.juniper.sd.policy-management.firewall.devices+json;version=3;q=0.03",
    ACCEPT_HEADER: "Accept"
  }, FWRuleGridConstants);

  //TODO - Overriding extended value for now, as POLICY_URL is getting set to old value.
  FirewallPolicyDeviceConstants.POLICY_URL = "/api/juniper/sd/policy-management/firewall/devices/";

  return FirewallPolicyDeviceConstants;

});