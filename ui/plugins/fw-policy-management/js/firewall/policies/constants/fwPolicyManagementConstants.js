define([
  '../../../../../base-policy-management/js/policy-management/constants/basePolicyManagementConstants.js'
], function(BasePolicyManagementConstants){
  var FirewallPolicyManagementConstants = $.extend({},BasePolicyManagementConstants, {

    SERVICE_TYPE: 'firewall',

    BASE_POLICY_URL: "/api/juniper/sd/policy-management/firewall/policies",
    POLICY_URL: "/api/juniper/sd/policy-management/firewall/policies/",
    POLICIES_ACCEPT_HEADER: "application/vnd.juniper.sd.policy-management.firewall.policies+json;version=2",
    POLICY_ACCEPT_HEADER: "application/vnd.juniper.sd.policy-management.firewall.policy+json;version=2",
    POLICY_CONTENT_HEADER: "application/vnd.juniper.sd.policy-management.firewall.policy+json;version=2;charset=UTF-8",
    POLICY_DELETE_CONTENT_TYPE : 'application/vnd.juniper.sd.bulk-delete+json;version=2;charset=UTF-8',
    POLICY_MIME_TYPE:'vnd.juniper.net.firewall.policies',

    //single device selection
    POLICY_ASSIGN_DEV_CONTENT_HEADER:'application/vnd.juniper.sd.policy-management.assign-devices+json;version=2;charset=UTF-8',
    POLICY_DEVICESFORPOLICY_ACCEPT_HEADER: 'application/vnd.juniper.sd.policy-management.devices+json;version=2;q=0.02',

    //Hit Count
    POLICY_LATEST_HITS:'POLICY_LATEST_HITS',
    RESET_POLICY_HITS:'RESET_POLICY_HITS',

    //source id
    SOURCE_ID_REFRESH: '/src-identity/refresh',
    SOURCE_ID_REFRESH_CONTENT_TYPE: 'application/vnd.juniper.sd.firewall-policies.src-identity+json;version=1;charset=UTF-8',

    //rule name template
    RULE_NAME_TEMPLATE_URL:'/api/juniper/sd/policy-management/firewall/rule-name-template-management/rule-name-template',

    //publish/update
    PUBLISH_MIME_TYPE: 'vnd.juniper.net.service.fw.publish',
    UPDATE_MIME_TYPE: 'vnd.juniper.net.service.fw.update',

    //snapshot compare
    SNAPSHOT_VERSION_COMPARE_CONTENT_TYPE :'application/vnd.juniper.sd.fw-policy-management.compare-policy-versions-request+json;version=1;charset=UTF-8',
    SNAPSHOT_VERSION_COMPARE_RESULT_URL : '/api/juniper/sd/policy-management/firewall/policies/compare-report?uuid=',

    //policy compare
    POLICY_COMPARE_URL : '/api/juniper/sd/policy-management/firewall/policies/compare',
    POLICY_COMPARE_CONTENT_TYPE : 'application/vnd.juniper.sd.fw-policy-management.compare-policy-request+json;version=1;charset=UTF-8',
    POLICY_COMPARE_RESULT_URL : '/api/juniper/sd/policy-management/firewall/policies/compare-report?uuid=',

    //policy/snapshot diff download
    POLICY_DIFF_DOWNLOAD_URL : '/api/juniper/sd/policy-management/firewall/policies/download-file?file-name=',

    //export
    EXPORT_POLICY_URL:'/api/juniper/sd/policy-management/firewall/policies/export',
    EXPORT_POLICY_CONTENT_HEADER:'application/vnd.juniper.sd.fw-policy-management.export-policy-request+json;version=1;charset=UTF-8',

    //clone
    CLONE_POLICY_URL : '/api/juniper/sd/policy-management/firewall/clone/',

    //capabilities
    CREATE_CAPABILITY: ["CreatePolicy"],
    MANAGE_POLICY_CAPABILITY: ["managePolicies"],
    MODIFY_CAPABILITY: ["ModifyPolicy"],
    DELETE_CAPABILITY: ["DeletePolicy"],
    UNLOCK_POLICY_CAPABILITY: ['unlockFirewallPolicy'],
    ASSIGN_TO_DOMAIN_CAPABILITY: ["AssignFWPolicyToDomainCap"],
    ASSIGN_DEVICE_CAPABILITY: ['assignDevices'],
    PUBLISH_POLICY_CAPABILITY: ['PublishPolicy'],
    UPDATE_DEVICE_CAPABILITY: ['UpdateDevice'],
    EXPORT_POLICY_CAPABILITY: ["ExportPolicy"],
    RESET_HIT_COUNT_CAPABILITY: ["ResetHitCount"],
    RULE_NAME_TEMPLATE_CAPABILITY: ["RuleNameTemplatePolicy"],
    CUSTOM_COLUMN_MANAGE_CAPABILITY: ['CustomColumn.manage'],

    //Generate policy analysis report
    POLICY_ANALYSIS_REPORT_LOCATION : "/api/juniper/seci/report-management/download-pdf?file-name=",
    
    //CUSTOM COLUMNS 
    GET_ALL_CUSTOM_COLUMNS : '/api/juniper/sd/policy-management/custom-column-management/custom-columns/',
    GET_ALL_CUSTOM_COLUMNS_ACCEPT_HEADER  : 'application/vnd.sd.policy-management.custom-column-management.custom-columns+json;version=4;q=0.04',

    DOWNLOAD_VERSION_DOC_URL :'/api/juniper/sd/policy-management/firewall/snapshot-version-documents?service-id=',
    DOWNLOAD_VERSION_DOC_PATH : '/api/juniper/sd/policy-management/firewall/version-download-file?file-name='
  });

  return FirewallPolicyManagementConstants;

});