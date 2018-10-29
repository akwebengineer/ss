define([
    '../../../../base-policy-management/js/policy-management/rules/util/ruleGridConstants.js'
], function(CommonRulesConstants){
    var AppFwPolicyConstants = $.extend({} , CommonRulesConstants, {
        POLICY_URL : "/api/juniper/sd/policy-management/firewall/app-fw-policy-management/app-fw-policies/",
        POLICY_GET_URL: "/api/juniper/sd/policy-management/firewall/app-fw-policy-management/app-fw-policies/",
        POLICY_ACCEPT_HEADER : "application/vnd.juniper.sd.app-fw-policy-management.app-fw-policy+json;version=1;q=0.01",
        RULE_ACCEPT_HEADER: "application/vnd.juniper.sd.appfw-profile-draft.rules+json;version=1;q=0.01",
        RULE_CONTENT_HEADER: "application/vnd.juniper.sd.appfw-profile-draft.rules+json;version=1;charset=UTF-8",
        DRAFT_SAVE_POLICY : "/draft/save-profile",
        RULE_JSON_ROOT: 'app-fw-rule',
        CAPABILITY_MODIFY: 'modifyAppFwPolicy',
        CAPABILITY_READ: 'manageAppFWPolicy',
        POLICY_MIME_TYPE:"appSecur/json",
        POLICY_CONTENT_TYPE_HEADER : "application/vnd.juniper.sd.app-fw-policy-management.app-fw-policy+json;version=1;charset=UTF-8"
    });

    return AppFwPolicyConstants;

});
