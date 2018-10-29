define([

], function(){
    var PublishConstants= {

        POLICY:"POLICY",
        IPSPOLICY:'IPSPOLICY',
        NAT: "NAT",
        VPN: "VPN",
        
        GLOBAL_POLICY_PUBLISH_URL:"/api/juniper/sd/policy-management/firewall/policies?filter=(policy-type+eq+'GLOBAL')",
        GLOBAL_POLICY_PUBLISH_ACCEPT_HEADER:'application/vnd.juniper.sd.policy-management.firewall.policies+json;version=2',
        POLICY_PUBLISHED: "PUBLISHED",
        POLICY_FULLY_PUBLISHED: "FULLY_PUBLISHED",
         POLICY_NOT_PUBLISHED: "NOT_PUBLISHED",
        ALL_DEVICE_POLICY_PRE: "PRE",
        ALL_DEVICE_POLICY_POST: "POST",
        
        SCHEDULE_CONF_JOB_URL: '/api/juniper/sd/#0/provisioning/preview?sd-device-id=#1',
        SCHEDULE_CONF_JOB_ACCEPT_HEADER: 'application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01',
        SCHEDULE_CONF_JOB_CONTENT_TYPE_HEADER: "application/vnd.juniper.sd.fwpolicy-provisioning.preview+json;version=1;charset=UTF-8",
        
        PUBLISH_URL: '/api/juniper/sd/#0/provisioning/publish',
        PUBLISH_ACCEPT_HEADER: 'application/vnd.juniper.sd.fwpolicy-provisioning.monitorable-task-instances+json;version=1;q=0.01',
        PUBLISH_CONTENT_TYPE_HEADER: 'application/vnd.juniper.sd.#0.publish+json;version=1;charset=UTF-8',

        PUBLISH_CACHE_URL: '/api/juniper/sd/#0/provisioning/publish-cache/#1',
        RETRY_JOB_URL: "/api/space/job-management/jobs/#0",
        
        PUBLISH_DEVICE_CC_STATE_URL: '/api/juniper/sd/device-management/device-cc-status',
        PUBLISH_DEVICE_CC_STATE_ACCEPT_HEADER: 'application/vnd.juniper.sd.device-management.device-cc-status-response+json;version=1;q=0.01',
        PUBLISH_DEVICE_CC_STATE_CONTENT_TYPE_HEADER: 'application/vnd.juniper.sd.device-management.id-list+json;version=1;charset=UTF-8',

        DEVICE_UPDATE_URL : '/api/juniper/sd/device-management/update-devices',
        DEVICE_UPDATE_ACCEPT_HEADER: "application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01",
        DEVICE_UPDATE_CONTENT_TYPE_HEADER: "application/vnd.juniper.sd.device-management.update-devices+json;version=1;charset=UTF-8",

        RETRY_UPDATE_ACCEPT_HEADER : 'application/vnd.net.juniper.space.job-management.job+json;q="0.03";version="3"',
        RETRY_UPDATE_INTENT_ACTION: "Space.Intent.action.DETAILED_JOB_VIEW",
        RETRY_UPDATE_INTENT_MIME_TYPE: "vnd.net.juniper.sm.job.detailedView",
        RETRY_UPDATE_FAILED_JOB_URL: '/api/juniper/sd/device-management/retry-failed-job',
        RETRY_UPDATE_FAILED_JOB_ACCEPT_HEADER: 'application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01',
        RETRY_UPDATE_FAILED_JOB_CONTENT_TYPE_HEADER : 'application/vnd.juniper.sd.device-management.retry-failjob-management+json;version=1;charset=UTF-8',

        // Publish states
        PUBLISH_STATE: {
            NOT_PUBLISHED : 'publish_state_not_published',
            PARTIALLY_PUBLISHED : "publish_state_partial_published",
            FULLY_PUBLISHED : "publish_state_published",
            RE_PUBLISH_REQUIRED : "publish_state_re_published",
            DELETED : "publish_state_deleted"
        },

        PUBLISH_MANDATORY_SELECT_URI : '/api/juniper/sd/policy-management/{service_type}/provisioning/devices-for-publish/mandatory-selected-ids',
        PUBLISH_MANDATORY_SELECT_ACCEPT_HEADER :'application/vnd.juniper.sd.select-all-ids+json;version=1;q=0.01',
        VPN_DRAFT_CHECK_URL: '/api/juniper/sd/vpn-management/ipsec-vpns/vpns-by-ids',
        VPN_DRAFT_CHECK_CONTENT_TYPE: 'application/vnd.juniper.sd.vpn-management.id-list+json;version=2;charset=UTF-8',
        VPN_DRAFT_CHECK_ACCEPT: 'application/vnd.juniper.sd.vpn-management.ipsec-vpns+json;version=2;q=0.02'

};

    return PublishConstants;

});
