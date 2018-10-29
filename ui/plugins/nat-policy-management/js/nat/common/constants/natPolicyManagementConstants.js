define([
  '../../../../../base-policy-management/js/policy-management/constants/basePolicyManagementConstants.js'
], function (BasePolicyManagementConstants) {
  var NATPolicyManagementConstants = $.extend({}, BasePolicyManagementConstants, {

    SERVICE_TYPE: 'nat',

    BASE_POLICY_URL: "/api/juniper/sd/policy-management/nat/policies",
    POLICY_URL : "/api/juniper/sd/policy-management/nat/policies/",
    POLICIES_ACCEPT_HEADER : "application/vnd.juniper.sd.policy-management.nat.policies+json;version=1;q=0.01",
    POLICY_ACCEPT_HEADER : "application/vnd.juniper.sd.policy-management.nat.policy+json;version=1;q=0.01",
    POLICY_CONTENT_HEADER : "application/vnd.juniper.sd.policy-management.nat.policy+json;version=1;charset=UTF-8",
    POLICY_DELETE_CONTENT_TYPE : 'application/vnd.juniper.sd.bulk-delete+json;version=1;charset=UTF-8',
    POLICY_MIME_TYPE:'vnd.juniper.net.nat.policies',

    //single device selection
    POLICY_ASSIGN_DEV_CONTENT_HEADER:'application/vnd.juniper.sd.policy-management.assign-devices+json;version=1;charset=UTF-8',
    POLICY_DEVICESFORPOLICY_ACCEPT_HEADER : 'application/vnd.juniper.sd.policy-management.devices+json;version=1;q=0.01',

    //rule name template
    RULE_NAME_TEMPLATE_URL:'/api/juniper/sd/policy-management/nat/rule-name-template-management/rule-name-template',

    //publish/update
    PUBLISH_MIME_TYPE: 'vnd.juniper.net.service.nat.publish',
    UPDATE_MIME_TYPE: 'vnd.juniper.net.service.nat.update',

    //export
    EXPORT_POLICY_CONTENT_HEADER:'application/vnd.juniper.sd.nat-policy-management.export-policy-request+json;version=1;charset=UTF-8',
    EXPORT_POLICY_URL:'/api/juniper/sd/policy-management/nat/policies/export',

    //snapshot compare
    SNAPSHOT_VERSION_COMPARE_CONTENT_TYPE : 'application/vnd.juniper.sd.nat-policy-management.compare-policy-versions-request+json;version=1;charset=UTF-8',
    SNAPSHOT_VERSION_COMPARE_RESULT_URL : '/api/juniper/sd/policy-management/nat/policies/compare-report?uuid=',

    //policy compare
    POLICY_COMPARE_URL : '/api/juniper/sd/policy-management/nat/policies/compare',
    POLICY_COMPARE_CONTENT_TYPE : 'application/vnd.juniper.sd.nat-policy-management.compare-policy-request+json;version=1;charset=UTF-8',
    POLICY_COMPARE_RESULT_URL : '/api/juniper/sd/policy-management/nat/policies/compare-report?uuid=',

    //policy/snapshot diff download
    POLICY_DIFF_DOWNLOAD_URL : '/api/juniper/sd/policy-management/nat/policies/download-file?file-name=',

    //clone
    CLONE_POLICY_URL : '/api/juniper/sd/policy-management/nat/clone/',

    //capabilities
    CREATE_CAPABILITY: ["createNATPolicy"],
    MANAGE_POLICY_CAPABILITY: ["manageNATPolicy"],
    MODIFY_CAPABILITY: ["modifyNATPolicy"],
    DELETE_CAPABILITY: ["deleteNATPolicy"],
    UNLOCK_POLICY_CAPABILITY: ['unlockNATPolicy'],
    ASSIGN_TO_DOMAIN_CAPABILITY: ["AssignNatPolicyToDomainCap"],
    ASSIGN_DEVICE_CAPABILITY: ['assignDevicesToNATPolicy'],
    PUBLISH_POLICY_CAPABILITY: ['publishNATPolicy'],
    UPDATE_DEVICE_CAPABILITY: ['UpdateDevice'],
    EXPORT_POLICY_CAPABILITY: ["exportNATPolicy"],
    RULE_NAME_TEMPLATE_CAPABILITY: ["RuleNameTemplateNATPolicy"],

    PORT_SETS_URL : "/api/juniper/sd/portset-management/port-sets",
    PORT_SETS_ACCEPT_HEADER : "application/vnd.juniper.sd.portset-management.port-set-refs+json;version=1;q=0.01",
    PORT_SETS_CREATE_ACCEPT_HEADER : "application/vnd.juniper.sd.portset-management.port-set+json;version=1;q=0.01",
    PORT_SETS_CONTENT_HEADER :"application/vnd.juniper.sd.portset-management.port-set+json;version=1;charset=UTF-8",
    PORT_SETS_DUPLICATE_MERGE_URL:"/api/juniper/sd/portset-management/port-sets/merge",
    PORT_SETS_DUPLICATE_MERGE_ACCEPT_HEADER:"application/vnd.juniper.sd.portset-management.port-set.merges+json;version=2;q=0.02",
    PORT_SETS_DUPLICATE_MERGE_CONTENT_HEADER:"application/vnd.juniper.sd.portset-management.port-set.merge-request+json;version=2;charset=UTF-8",

    NAT_POOLS_URL : "/api/juniper/sd/nat-pool-management/nat-pools",
    NAT_POOLS_ACCEPT_HEADER : "application/vnd.juniper.sd.nat-pool-management.nat-pools+json;version=2;q=0.02",
    NAT_POOLS_CREATE_ACCEPT_HEADER : "application/vnd.juniper.sd.nat-pool-management.nat-pool+json;version=2;q=0.02",
    NAT_POOLS_CONTENT_HEADER :	"application/vnd.juniper.sd.nat-pool-management.nat-pool+json;version=2;charset=UTF-8",
    NAT_POOLS_DUPLICATE_MERGE_URL:"/api/juniper/sd/nat-pool-management/nat-pools/merge",
    NAT_POOLS_DUPLICATE_MERGE_ACCEPT_HEADER:"application/vnd.juniper.sd.nat-pool-management.nat-pools.merges+json;version=2;q=0.02",
    NAT_POOLS_DUPLICATE_MERGE_CONTENT_HEADER:"application/vnd.juniper.sd.nat-pool-management.nat-pools.merge-request+json;version=2;charset=UTF-8",
    NAT_POOLS_REPLACE_URL:'/api/juniper/sd/nat-pool-management/nat-pools/replace',
    NAT_POOLS_REPLACE_ACCEPT_HEADER : "application/vnd.juniper.sd.nat-pool-management.replaces+json;version=2;q=0.02",
    NAT_POOLS_REPLACE_CONTENT_HEADER : "application/vnd.juniper.sd.nat-pool-management.replace-request+json;version=2;charset=UTF-8",

    RULE_SETS_ACCEPT_HEADER : "application/vnd.juniper.sd.policy-management.nat.policy-rule-set+json;q=0.03;version=3",
    RULE_SETS_CONTENT_TYPE :'application/vnd.juniper.sd.policy-management.nat.policy-rule-set+json;version=3;charset=UTF-8',

    ADDRESSES_URL : "/api/juniper/sd/address-management/addresses",
    ADDRESSES_ACCEPT_HEADER : "application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01",
    ADDRESSES_CONTENT_HEADER : "application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01",

    DEVICES_URL : "/api/juniper/sd/device-management/devices",
    DEVICES_ACCEPT_HEADER : "application/vnd.juniper.sd.device-management.devices-extended+json;version=2;q=0.02",

    DOWNLOAD_VERSION_DOC_URL :'/api/juniper/sd/policy-management/nat/snapshot-version-documents?service-id=',
    DOWNLOAD_VERSION_DOC_PATH : '/api/juniper/sd/policy-management/nat/version-download-file?file-name=',

    getRuleSetsUrl : function(policyId) {
      return this.POLICY_URL + policyId + "/policy-rule-set";
    }
  });

  return NATPolicyManagementConstants;

});
