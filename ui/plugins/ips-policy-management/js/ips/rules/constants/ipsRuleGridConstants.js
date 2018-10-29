define([
  '../../../../../base-policy-management/js/policy-management/rules/util/ruleGridConstants.js'
], function(CommonPolicyConstants){
  var IPSRuleGridConstants = $.extend({
    POLICY_URL: "/api/juniper/sd/policy-management/ips/policies/",
    POLICIES_ACCEPT_HEADER: 'application/vnd.juniper.sd.policy-management.ips.policies+json;version="2"',
    POLICY_ACCEPT_HEADER: "application/vnd.juniper.sd.policy-management.ips.policy+json;version=2",
    POLICY_CONTENT_HEADER: "application/vnd.juniper.sd.policy-management.ips.policy+json;version=2;charset=UTF-8",
    RULE_ACCEPT_HEADER: "application/vnd.juniper.sd.ips-policies-draft.rules+json;version=1;q=0.01",
    RULE_CONTENT_HEADER: "application/vnd.juniper.sd.ips-policies-draft.rules+json;version=1;charset=UTF-8",
    POLICY_PROFILES: "/api/juniper/sd/fwpolicy-management/policy-profiles",
    IPS_TYPE_EXEMPT: "EXEMPT",
    IPS_TYPE_DEFAULT: "IPS",
    POLICY_VPN_ACCEPT_HEADER: "application/vnd.juniper.sd.ips-policies-draft.vpn-tunnels+json;version=1;q=0.01",
    POLICY_VPN_CONTENT_TYPE: "application/vnd.juniper.sd.ips-policies-draft.vpn-tunnels+json;version=1;charset=UTF-8",
    RULE_JSON_ROOT: 'ips-rule',
    JSON_ID : "id",
    CAPABILITY_MODIFY: "modifyIPSPolicy",
    CAPABILITY_READ: "viewIPSPolicy",
    CAPABILITY_PUBLISH: "PublishIPSPolicy",
    CAPABILITY_UPDATE_DEVICE: "UpdateDevice",
    PUBLISH_MIME_TYPE: 'vnd.juniper.net.service.ips.publish',
    EXEMPT: "Exempt",
    RULE_TYPE : "IPS" ,//used for context menu
    NO_ACTION : "No Action",
    IGNORE : "Ignore",
    DROP_PACKET : "Drop Packet",
    DROP_CONNECTION : "Drop Connection",
    CLOSE_CLIENT : "Close Client",
    CLOSE_SERVER : "Close Server",
    CLOSE_CLIENT_SERVER : "Close Client And Server",
    RECOMMENDED : "Recommended",
    DIFFSERV_MARKING :"DiffServ Marking",
    UPDATE_MIME_TYPE : 'vnd.juniper.net.service.ips.update',
    POLICY_MIME_TYPE:'vnd.juniper.net.ips.policies',
      //EXPORT
    EXPORT_POLICY_URL:'/api/juniper/sd/policy-management/ips/policies/export',
    EXPORT_POLICY_CONTENT_HEADER:'application/vnd.juniper.sd.ips-policy-management.export-policy-request+json;version=1;charset=UTF-8'
  }, CommonPolicyConstants);

  return IPSRuleGridConstants;

});
