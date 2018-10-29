define([
  '../../../../../base-policy-management/js/policy-management/rules/util/ruleGridConstants.js'
], function(CommonPolicyConstants){
    var FirewallRuleGridConstants = $.extend({
        POLICY_URL: "/api/juniper/sd/policy-management/firewall/policies/",
        POLICIES_ACCEPT_HEADER: 'application/vnd.juniper.sd.policy-management.firewall.policies+json;version="2"',
        POLICY_ACCEPT_HEADER: "application/vnd.juniper.sd.policy-management.firewall.policy+json;version=2",
        POLICY_CONTENT_HEADER: "application/vnd.juniper.sd.policy-management.firewall.policy+json;version=2;charset=UTF-8",
        RULE_ACCEPT_HEADER: "application/vnd.juniper.sd.firewall-policies-draft.rules+json;version=1;q=0.01",
        RULE_CONTENT_HEADER: "application/vnd.juniper.sd.firewall-policies-draft.rules+json;version=1;charset=UTF-8",
        POLICY_PROFILES: "/api/juniper/sd/fwpolicy-management/policy-profiles",
        POLICY_VPN_ACCEPT_HEADER: "application/vnd.juniper.sd.firewall-policies-draft.vpn-tunnels+json;version=1;q=0.01",
        POLICY_VPN_CONTENT_TYPE: "application/vnd.juniper.sd.firewall-policies-draft.vpn-tunnels+json;version=1;charset=UTF-8",
        RULE_JSON_ROOT: 'firewall-rule',
        DEVICE_HIT_COUNT: "/device-hit-count",
        RELOAD_HIT_COUNT: "/reload-hit-count",
        NEW: "/draft/rules/new",
        VPN_TUNNELS: "/vpn-tunnels",
        CAPABILITY_MODIFY: "ModifyPolicy",
        CAPABILITY_READ: "managePolicies",
        CAPABILITY_PUBLISH: "PublishPolicy",
        CAPABILITY_UPDATE_DEVICE: "UpdateDevice",
        PUBLISH_MIME_TYPE: 'vnd.juniper.net.service.fw.publish',
        UPDATE_MIME_TYPE : 'vnd.juniper.net.service.fw.update',
        POLICY_NAME : "policy-name",
        EVENT_CATEGORY : "event-category",
        SOURCE_ZONE : "source-zone-name",
        DESTINATION_ZONE : "destination-zone-name",
        RULE_TYPE : "FW", //used for context menu
        RULE_ANALYSIS_REPORT_URL: "/api/juniper/seci/report-management/policy-analysis-report?file-name=",
        RULE_ANALYSIS_REPORT_ACCEPT_HEADER: "application/vnd.juniper.seci.report-management.preview-report-response+json;version=1;q=0.01",
        RULE_ANALYSIS_DOWNLOAD_PDF_URL: "/api/juniper/seci/report-management/download-pdf?file-name=",
        POLICY_MIME_TYPE:'vnd.juniper.net.firewall.policies',

        UTM_URL : "/api/juniper/sd/utm-management/utm-policies",
        UTM_ACCEPT_HEADER : "application/vnd.juniper.sd.utm-management.utm-policy-refs+json;version=1",

        SSLPROXY_URL :"/api/juniper/sd/ssl-forward-proxy-profile-management/ssl-forward-proxy-profiles",
        SSLPROXY_ACCEPT_HEADER : "application/vnd.juniper.sd.ssl-forward-proxy-profile-management.ssl-forward-proxy-profiles+json;version=2;q=0.02",

        APPFW_URL : "/api/juniper/sd/policy-management/firewall/app-fw-policy-management/app-fw-policies",
        APPFW_ACCEPT_HEADER : "application/vnd.juniper.sd.app-fw-policy-management.app-fw-policies+json;version=1;q=0.01",

        SCHEDULER_URL : "/api/juniper/sd/scheduler-management/schedulers",
        SCHEDULER_ACCEPT_HEADER : "application/vnd.juniper.sd.scheduler-management.schedulers+json;version=1",

        //task progress url
        TASK_PROGRESS_URL : '/api/juniper/sd/task-progress/',
        TASK_PROGRESS_ACCEPT : 'application/vnd.juniper.sd.task-progress.task-progress-response+json;version=2;q=0.02',

        //EXPORT
        EXPORT_POLICY_URL:'/api/juniper/sd/policy-management/firewall/policies/export',
        EXPORT_POLICY_CONTENT_HEADER:'application/vnd.juniper.sd.fw-policy-management.export-policy-request+json;version=1;charset=UTF-8',
        //Shared Object Grid user preferences
        USER_PREF_SHARED_OBJECT_SELECTION_KEY: 'sm:fw-rules:shared_object_panel_type'
        
    }, CommonPolicyConstants);

    return FirewallRuleGridConstants;

});
