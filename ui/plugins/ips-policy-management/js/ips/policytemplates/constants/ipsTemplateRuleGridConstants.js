define([
  '../../rules/constants/ipsRuleGridConstants.js'
], function(IPSRuleGridConstants){
  var IPSTemplateRuleGridConstants = $.extend({}, IPSRuleGridConstants, {
    POLICY_URL: "/api/juniper/sd/policy-management/ips/policy-templates/",
    POLICIES_ACCEPT_HEADER: 'application/vnd.juniper.sd.policy-management.ips.policy-templates+json;version=3;q=0.03',
    POLICY_ACCEPT_HEADER: "application/vnd.juniper.sd.policy-management.ips.policy-template+json;version=3;q=0.03",
    POLICY_CONTENT_HEADER: "application/vnd.juniper.sd.policy-management.ips.policy-template+json;version=3;charset=UTF-8",
    POLICY_MIME_TYPE: 'vnd.juniper.net.ips.policy-templates'
  });
  return IPSTemplateRuleGridConstants;

});
