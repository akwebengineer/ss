define([
  '../../../../../base-policy-management/js/policy-management/constants/basePolicyManagementConstants.js'
], function(BasePolicyManagementConstants) {
  var IPSPolicyManagementConstants = $.extend({}, BasePolicyManagementConstants, {

    SERVICE_TYPE: 'ips',


    BASE_POLICY_URL : "/api/juniper/sd/policy-management/ips/policies",
    POLICY_URL : "/api/juniper/sd/policy-management/ips/policies/",
    POLICIES_ACCEPT_HEADER : "application/vnd.juniper.sd.policy-management.ips.policies+json;version=2;q=0.02",
    POLICY_ACCEPT_HEADER : "application/vnd.juniper.sd.policy-management.ips.policy+json;version=2;q=0.02",
    POLICY_CONTENT_HEADER : "application/vnd.juniper.sd.policy-management.ips.policy+json;version=2;charset=UTF-8",
    POLICY_DELETE_CONTENT_TYPE : 'application/vnd.juniper.sd.bulk-delete+json;version=2;charset=UTF-8',
    POLICY_MIME_TYPE:'vnd.juniper.net.ips.policies',


    //single device selection
    POLICY_ASSIGN_DEV_CONTENT_HEADER:'application/vnd.juniper.sd.policy-management.assign-devices+json;version=2;charset=UTF-8',
    POLICY_DEVICESFORPOLICY_ACCEPT_HEADER : 'application/vnd.juniper.sd.policy-management.devices+json;version=2;q=0.02',

    //rule name template
    RULE_NAME_TEMPLATE_URL:'/api/juniper/sd/policy-management/ips/rule-name-template-management/rule-name-template',

    //publish/update
    PUBLISH_MIME_TYPE: 'vnd.juniper.net.service.ips.publish',
    UPDATE_MIME_TYPE: 'vnd.juniper.net.service.ips.update',

    //export
    EXPORT_POLICY_CONTENT_HEADER:'application/vnd.juniper.sd.ips-policy-management.export-policy-request+json;version=1;charset=UTF-8',
    EXPORT_POLICY_URL:'/api/juniper/sd/policy-management/ips/policies/export',

    //snapshot compare
    SNAPSHOT_VERSION_COMPARE_CONTENT_TYPE :'application/vnd.juniper.sd.ips-policy-management.compare-policy-versions-request+json;version=1;charset=UTF-8',
    SNAPSHOT_VERSION_COMPARE_RESULT_URL : '/api/juniper/sd/policy-management/ips/policies/compare-report?uuid=',

    //policy compare
    POLICY_COMPARE_URL : '/api/juniper/sd/policy-management/ips/policies/compare',
    POLICY_COMPARE_CONTENT_TYPE : 'application/vnd.juniper.sd.ips-policy-management.compare-policy-request+json;version=1;charset=UTF-8',
    POLICY_COMPARE_RESULT_URL : '/api/juniper/sd/policy-management/ips/policies/compare-report?uuid=',

    //clone
    CLONE_POLICY_URL : '/api/juniper/sd/policy-management/ips/clone/',

    //capabilities
    CREATE_CAPABILITY: ["createIPSPolicy"],
    MANAGE_POLICY_CAPABILITY: ["manageIPSPolicy"],
    MODIFY_CAPABILITY: ["modifyIPSPolicy"],
    DELETE_CAPABILITY: ["deleteIPSPolicy"],
    UNLOCK_POLICY_CAPABILITY: ['unlockIPSPolicy'],
    ASSIGN_TO_DOMAIN_CAPABILITY: ["AssignIPSPolicyToDomainCap"],
    ASSIGN_DEVICE_CAPABILITY: ['assignDevicesIPSPolicy'],
    PUBLISH_POLICY_CAPABILITY: ['PublishIPSPolicy'],
    UPDATE_DEVICE_CAPABILITY: ['UpdateDevice'],
    RULE_NAME_TEMPLATE_CAPABILITY: ["RuleNameTemplateIPSPolicy"],

    IPS_TEMPLATE_URL : "/api/juniper/sd/ips-management/ips-sig-sets",
    IPS_TEMPLATE_ACCEPT_HEADER : "application/vnd.juniper.sd.ips-management.ips-sig-sets+json;q=0.01;version=1",

    DOWNLOAD_VERSION_DOC_URL :'/api/juniper/sd/policy-management/ips/snapshot-version-documents?service-id=',
    DOWNLOAD_VERSION_DOC_PATH : '/api/juniper/sd/policy-management/ips/version-download-file?file-name='
  });

  return IPSPolicyManagementConstants;
});