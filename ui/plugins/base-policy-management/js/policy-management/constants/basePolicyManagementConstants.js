/**
 * Created by mbetala on 1/9/16.
 */

define([], function(){
  var BasePolicyManagementConstants = {
    POLICY_FULLY_PUBLISHED: "FULLY_PUBLISHED",
    POLICY_NOT_PUBLISHED: "NOT_PUBLISHED",
    DEVICE: "DEVICE",
    GLOBAL: "GLOBAL",
    POLICY_DELETE: 'delete',
    UN_ASSIGN_DEVICE_EVENT: "unassignDeviceEvent",
    ASSIGN_DEVICE_EVENT: "assignDevicesEvent",

    //Table Height
    TABLE_HEIGHT: "auto",

    //device selector
    ASSIGN_DEVICES_AVAILABLE_ACCEPT: "application/vnd.juniper.sd.policy-management.devices+json;version=1;q=0.01",
    ASSIGN_DEVICES_AVAILABLE_DEVICES :'/available-devices',
    ASSIGN_DEVICES_SELECTED_DEVICES: '/selected-devices',
    ASSIGN_DEVICES_SELECT_ACCEPT: "application/vnd.juniper.sd.policy-management.devices+json;version=1;q=0.01",
    ASSIGN_DEVICES_SELECT_CONTENT_TYPE: "application/vnd.juniper.sd.policy-management.select-devices+json;version=1;charset=UTF-8",
    ASSIGN_DEVICES_DESELECT_CONTENT_TYPE: "application/vnd.juniper.sd.policy-management.de-select-devices+json;version=1;charset=UTF-8",
    ASSIGN_DEVICES_AVAILABLE_DEVICES_IDS: '/available-devices-ids',
    ASSIGN_DEVICES_SELECTED_DEVICES_IDS: '/selected-devices-ids',
    ASSIGN_DEVICES_ASSIGNED_DEVICES_IDS: '/assigned-devices-ids',
    ASSIGN_DEVICES_AVAILABLE_ALL_ACCEPT: 'application/vnd.juniper.sd.policy-management.devices-ids+json;version=1;q=0.01',
    ASSIGN_DEVICES_SELECT_ALL_ACCEPT: 'application/vnd.juniper.sd.policy-management.devices-ids+json;version=1;q=0.01',
    ASSIGN_DEVICES_ASSIGNED_DEVICES_IDS_ACCEPT: 'application/vnd.juniper.sd.policy-management.devices-ids+json;version=1;q=0.01',

    //rule name template
    RULE_NAME_CONTENT_TYPE : 'application/vnd.juniper.sd.policy-management.rule-name-template-management.rule-name-template+json;version=2;charset=UTF-8',
    RULE_NAME_ACCEPT_HEADER: 'application/vnd.juniper.sd.policy-management.rule-name-template-management.rule-name-template+json;version=2;q=0.02',

    //Custom Column
    CUSTOM_COLUMN_URL:'/api/juniper/sd/policy-management/custom-column-management/custom-columns',
    CUSTOM_COLUMN_ACCEPT_HEADER: 'application/vnd.sd.policy-management.custom-column-management.custom-columns+json;version=4;q=0.04',
    CUSTOM_COLUMN_CONTENT_TYPE : 'application/vnd.juniper.sd.policy-management.custom-column-management.custom-columns+json;version=2;charset=UTF-8',
    CUSTOM_COLUMN_MODIFY_CONTENT_URL: 'application/vnd.sd.policy-management.custom-column-management.custom-column-ref+json;version=4;charset=UTF-8',
    CUSTOM_COLUMN_MODIFY_URL: '/api/juniper/sd/policy-management/custom-column-management/custom-columns/',
    CUSTOM_COLUMN_GET_URL: '/api/juniper/sd/policy-management/custom-column-management/custom-columns',
    CUSTOM_COLUMN_DELETE_URL: '/api/juniper/sd/policy-management/custom-column-management/custom-columns',
    CUSTOM_COLUMN_DELETE_CONTENT_URL: 'application/vnd.sd.policy-management.custom-column-management.delete-custom-columns-request+json;version=4;charset=UTF-8',
    CUSTOM_COLUMN_CREATE_URL: '/api/juniper/sd/policy-management/custom-column-management/custom-column' ,
    CUSTOM_COLUMN_CREATE_CONTENT_URL:'application/vnd.sd.policy-management.custom-column-management.custom-column-ref+json;version=4;charset=UTF-8',
    CUSTOM_COLUMN_CREATE_ACCEPT_URL:'application/vnd.sd.policy-management.custom-column-management.create-custom-column-response+json;version=4;q=0.04',
    CUSTOM_COLUMN_GET_ACCEPT_URL:'application/vnd.sd.policy-management.custom-column-management.custom-columns+json;version=4;q=0.04',

     //export
    EXPORT_POLICY_ACCEPT_HEADER:'application/vnd.net.juniper.space.job-management.task+json;version=1;',
    PDF:'PDF_FORMAT',
    HTML:'HTML_FORMAT',
    ZIP: 'ZIP_FORMAT',

    //Download Zip
    DOWNLOAD_VERSION_DOC_ACCEPT : 'application/vnd.sd.policy-management.snapshot-version-document-response+json;version=1;q=0.01',

    //snapshot create
    POLICY_CREATE_SNAPSHOT_ACCEPT_HEADER  :'application/vnd.juniper.sd.policy-versioning-management.version-meta-datas+json;version=1;q=0.01',
    POLICY_CREATE_SNAPSHOT_CONTENT_HEADER :'application/vnd.juniper.sd.policy-versioning-management.create-snapshot-request+json;version=1;charset=UTF-8',

    //task progress url
    TASK_PROGRESS_URL : '/api/juniper/sd/task-progress/',
    TASK_PROGRESS_ACCEPT : 'application/vnd.juniper.sd.task-progress.task-progress-response+json;version=2;q=0.02',


    //Snapshot
    SNAPSHOT_CREATE_ACCEPT_HEADER :'application/vnd.juniper.sd.policy-versioning-management.create-snapshot-response+json;version=1;q=0.01',


    //Policy lock
    POLICY_LOCK_ACCEPT:"application/vnd.juniper.sd.lock-management.object-lock+json;version=2;q=0.02",

    //Filters
    HIDE_POLICIES_WITH_NO_DEVICES : "hidePoliciesWithNoDevices",
    HIDE_POLICIES_WITH_NO_RULES : "hidePoliciesWithNoRules",
    OPERATOR_CONNECTOR_MAP : {
      "="  : " eq ",
      ">=" : " ge ",
      "=<" : " le ",
      ">"  : " gt ",
      "<"  : " lt "
    },

    //Delete
    DELETE_CONTENT_TYPE : 'application/vnd.juniper.sd.bulk-delete+json;version=1;charset=UTF-8',

    //Predefined policy groups
    POLICY_GROUP : {
      PRE_GROUP : {
        "description": "Predefined Group",
        "id": -10001,
        "name": "POLICIES APPLIED BEFORE 'DEVICE SPECIFIC POLICIES'",
        "isStatic": true,
        "expanded": true,
        "policy-position": "PRE"
      },
      DEVICE_GROUP : {
        "description": "Predefined Group",
        "id": -10002,
        "name": "DEVICE SPECIFIC POLICIES",
        "isStatic": true,
        "expanded": true,
        "policy-position": "DEVICE"
      },
      POST_GROUP : {
        "description": "Predefined Group",
        "id": -10003,
        "name": "POLICIES APPLIED AFTER 'DEVICE SPECIFIC POLICIES'",
        "isStatic": true,
        "expanded": true,
        "policy-position": "POST"
      }
    },

    getPolicyLockUrl: function() {
      return this.POLICY_URL + "lock";
    },

    getPolicyUnlockUrl: function() {
      return this.POLICY_URL + "unlock";
    },

    getAssignDevicesAvailableDevicesUrl : function(policyId) {
      return this.POLICY_URL + policyId + this.ASSIGN_DEVICES_AVAILABLE_DEVICES;
    },

    getAssignDevicesURLRoot : function(policyId) {
      return this.POLICY_URL + policyId + '/assign-devices';
    },

    getDevicesForPolicyURLRoot : function(policyId) {
      return this.POLICY_URL + policyId + '/devices';
    },

    getManageVersionURLRoot : function(policyId) {
      return this.POLICY_URL +  policyId + '/versions';
    },

    getAssignedDevicesIdsUrl : function(policyId){
      return this.POLICY_URL + policyId + this.ASSIGN_DEVICES_ASSIGNED_DEVICES_IDS;
    }
  };

  return BasePolicyManagementConstants;

});
