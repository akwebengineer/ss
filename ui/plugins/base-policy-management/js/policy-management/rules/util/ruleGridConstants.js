define([
  '../../../../../ui-common/js/common/intentActions.js'
], function(IntentActions) {
  var RuleGridConstants = {
    DEFAULT_PAGE_SIZE : 50,
    DIRECTION_MAP : {
      MOVE_RULE_TOP : "Top",
      MOVE_RULE_BOTTOM : "Bottom",
      MOVE_RULE_UP : "Up",
      MOVE_RULE_DOWN : "Down",
      PASTE_RULE_BEFORE : "Up",
      PASTE_RULE_AFTER: "Down"
    },
    DRAFT_SAVE_POLICY : "/draft/save-policy",
    RULE_DRAFT : "/draft/rules",
    RULE_DRAFT_MODIFY : "/draft/modify-rule",
    RULE_DRAFT_ADD : "/draft/add-rule",
    RULE_DRAFT_COPY : "/draft/rules/copy",
    RULE_DRAFT_ENABLE : "/draft/rules/enable",
    RULE_DRAFT_DISABLE : "/draft/rules/disable",
    RULE_DRAFT_CUT : "/draft/rules/cut",
    RULE_DRAFT_PASTE : "/draft/rules/paste-rules",
    RULE_DRAFT_MOVE : "/draft/rules/move-rule",
    RULE_DRAFT_EXPANDALL : "/draft/rules/expand-all",
    RULE_DRAFT_COLLAPSEALL: "/draft/rules/collapse-all",
    RULE_DRAFT_FILTER:"/draft/rules/filter",
    RULE_DRAFT_COPIED:"draft/rules/copied-rules",
    RULE_DRAFT_CLONE: "/clone",
    RULE_DRAFT_RESET_STORE: "/reset-store",
    RULE_VALIDATION_TOOLTIP: "/validation-tooltip",
    RULE_PAGE_NUMBER: "/page-number",
    JSON_ID: 'id',
    JSON_GROUP_ID: 'rule-group-id',
    RULE_DRAFT_UNGROUP: "/draft/rules/ungroup",
    AVAIL_ADDRESS: "/available-addresses",
    ANY_ADDRESS_FILTER: "filter=(addressType+eq+'ANY')",
    ADDRESS_ACCEPT: "application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01",
    AVAIL_SERVICE: "/available-services",
    ANY_SERVICE_FILTER: "filter=(name+eq+'ANY')",
    SERVICE_ACCEPT: "application/vnd.juniper.sd.service-management.services+json;version=1;q=0.01",
    FILTER_CONTENT_TYPE: "application/vnd.juniper.sd.firewall-policies-draft.rules+json;version=1;charset=UTF-8",
    SAVE_FAILED_FOR_VALIDATION_ERRORS: "SAVE_FAILED_FOR_VALIDATION_ERRORS",
    SAVE_FAILED_DUE_TO_SOME_INTERNAL_FAILURE: "SAVE_FAILED_DUE_TO_SOME_INTERNAL_FAILURE",
    SAVE_FAILED_DUE_TO_CONCURRENT_EDIT: "SAVE_FAILED_DUE_TO_CONCURRENT_EDIT",
    POLICY_EDIT_LOCK_NOT_AVAILABLE:"POLICY_EDIT_LOCK_NOT_AVAILABLE",

    IMAGE_LOCATION: '/installed_plugins/base-policy-management/images/',
    ICON_ERROR: 'icon_error.png',
    ICON_WARNING: 'icon_warning.png',
    ICON_INFO: 'icon_info.png',

    POLICY_LOCK: "/lock",
    POLICY_UNLOCK: "/unlock",
    POLICY_LOCKS:"/locks",
    POLICY_LOCK_SETTINGS : "lock-settings",
    POLICY_RESET_LOCK_TIMER : "/reset-lock-timer",
    POLICY_LOCK_SETTINGS_ACCEPT:'application/vnd.juniper.sd.lock-management.object-lock-settings+json;version=2;q=0.02',
    POLICY_LOCK_ACCEPT:"application/vnd.juniper.sd.lock-management.object-lock+json;version=2;q=0.02",

    RULE_DRAFT_CHANGED_RULE_IDS_ACCEPT: "application/vnd.juniper.sd.firewall-policies-draft.changed-rule-ids+json;version=1;q=0.01",
    RULE_DRAFT_CHANGED_RULE_IDS: "/draft/changed-rule-ids",
    
    ZONE_SETS_URL : '/api/juniper/sd/zoneset-management/zone-sets',
    ZONE_SETS_ACCEPT : 'application/vnd.juniper.sd.zoneset-management.zone-set-refs+json;version=1;q=0.01',
    validation_icon :{
                '-1' : 
                   {
                      'iconImg' : "",
                      'imgText' : "",
                      'imgClass': ""
                   },
                 '0' : 
                   { 'iconImg' : 'icon_error.png',
                     'imgText' : "Error",
                     'imgClass':  'icon_error'                 
                   },
                 '1' : 
                   { 'iconImg' : 'icon_warning.png',
                     'imgText' : "Warning",
                     'imgClass': 'icon_warning'                      
                   },
                 '2' : 
                   { 'iconImg' : 'icon_info.png',
                     'imgText' : "Info",
                     'imgClass': 'icon_info'                      
                   }
              },
    ADDRESS_GRID_VIEW_DATA : {
      id : 'ADDRESS',
      text : 'Addresses',
      action :  IntentActions.ACTION_LIST_CUSTOM_CONTAINER,
      mime_type : 'vnd.juniper.net.addresses',
      dragNDrop : {
        'groupId' : 'ADDRESS'
      }
    },
    SERVICE_GRID_VIEW_DATA : {
      id : 'SERVICE',
      text : 'Services',
      action :  IntentActions.ACTION_LIST_CUSTOM_CONTAINER,
      mime_type : 'vnd.juniper.net.services',
      dragNDrop : {
        'groupId' : 'SERVICE'
      }
    },
    MANAGE_ADDRESS_CAPABILITY : 'manageAddress',
    MANAGE_SERVICE_CAPABILITY : 'manageApplications',
    EXPORT_POLICY_CAPABILITY: "ExportPolicy",
    EXPORT_POLICY_ACCEPT_HEADER:'application/vnd.net.juniper.space.job-management.task+json;version=1;'
  }; 
  return RuleGridConstants;
});
