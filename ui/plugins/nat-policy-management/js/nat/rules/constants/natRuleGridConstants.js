define([
  '../../../../../base-policy-management/js/policy-management/rules/util/ruleGridConstants.js',
  '../../../../../ui-common/js/common/intentActions.js'
], function(CommonPolicyConstants, IntentActions){
  var NatRuleGridConstants = $.extend({}, CommonPolicyConstants, {
    POLICY_URL : "/api/juniper/sd/policy-management/nat/policies/",
    POLICY_ACCEPT_HEADER : "application/vnd.juniper.sd.policy-management.nat.policy+json;version=1",
    POLICY_CONTENT_HEADER : "application/vnd.juniper.sd.policy-management.nat.policy+json;version=1;charset=UTF-8",
    RULE_ACCEPT_HEADER : "application/vnd.juniper.sd.nat-policies-draft.rules+json;version=1;q=0.01",
    RULE_CONTENT_HEADER : "application/vnd.juniper.sd.nat-policies-draft.rules+json;version=1;charset=UTF-8",
    RULE_ARP_ENTRIES : "/arp-entries",
    POLICY_PROFILES : "/api/juniper/sd/natpolicy-management/policy-profiles",
    NAT_TYPE_STATIC:                 'STATIC',
    NAT_TYPE_SOURCE:                 'SOURCE',
    NAT_TYPE_DESTINATION:            'DESTINATION',
    TRAFFIC_MATCH_TYPE_ZONE:         'ZONE',
    TRAFFIC_MATCH_TYPE_INTERFACE:    'INTERFACE',
    TRAFFIC_MATCH_TYPE_VIRTUAL_ROUTER: 'VIRTUAL_ROUTER',
    TRAFFIC_MATCH_TYPE_POOL:         'POOL',
    RULE_ACTION_ON:                  'ON',
    RULE_ACTION_OFF:                 'OFF',
    ANY_REMOTE_HOST:                 'Permit any remote host',
    TARGET_HOST:                     'Permit target host',
    TARGET_HOST_PORT:                'Permit target host port',
    CAPABILITY_MODIFY: "modifyNATPolicy",
    CAPABILITY_READ: "manageNATPolicy",
    CAPABILITY_PUBLISH: "publishNATPolicy",
    CAPABILITY_UPDATE_DEVICE: "UpdateDevice",
    PUBLISH_MIME_TYPE: 'vnd.juniper.net.service.nat.publish',
    UPDATE_MIME_TYPE : 'vnd.juniper.net.service.nat.update',
    RULE_TYPE : "NAT", 
    RULE_JSON_ROOT: 'nat-rule',
    POLICY_MIME_TYPE:'vnd.juniper.net.nat.policies',

    ZONESET_URL: "/api/juniper/sd/zoneset-management/zone-sets",
    ZONESET_ACCEPT_HEADER: "application/vnd.juniper.sd.zoneset-management.zone-set+json;version=1",
    ZONESET_CONTENT_HEADER: "application/vnd.juniper.sd.zoneset-management.zone-set+json;version=1;charset=UTF-8",
    ADDRESS_GRID_VIEW_DATA : {
      id : 'ADDRESS',
      text : 'Address',
      action :  IntentActions.ACTION_LIST_CUSTOM_CONTAINER,
      mime_type : 'vnd.juniper.net.addresses',
      dragNDrop : {
        'groupId': 'ADDRESS_NATPOOL',
        'dragObjectType' : 'ADDRESS'
      }
    },
    NATPOOL_GRID_VIEW_DATA : {
      id : 'NATPOOL',
      text : 'Pools',
      action :  IntentActions.ACTION_LIST_CUSTOM_CONTAINER,
      mime_type : 'vnd.juniper.net.nat.natpools',
      dragNDrop : {
        'groupId': 'ADDRESS_NATPOOL',
        'dragObjectType' : 'NATPOOL'
      }
    },
    //Shared Object Grid user preferences
    USER_PREF_SHARED_OBJECT_SELECTION_KEY: 'sm:nat-rules:shared_object_panel_type',
    MANAGE_NAT_POOL_CAPABILITY : 'manageNATPool',
    //EXPORT
    EXPORT_POLICY_URL:'/api/juniper/sd/policy-management/nat/policies/export',
    EXPORT_POLICY_CONTENT_HEADER:'application/vnd.juniper.sd.nat-policy-management.export-policy-request+json;version=1;charset=UTF-8'
  });

  return NatRuleGridConstants;

});
