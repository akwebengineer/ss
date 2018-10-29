define([

], function(){
    var PolicyHitsConstants = {
        POLICY_HITS_URL: "/api/juniper/sd/policy-hit-count-manager/trigger-hit-count-polling",
        RESET_POLICY_HITS_URL: "/api/juniper/sd/policy-hit-count-manager/reset-hit-count",
        POLICY_HITS_ACCEPT_HEADER: "application/vnd.juniper.sd.policy-hit-count-manager.monitorable-task-instance-managed-object+json;version=1;q=0.01",
        POLICY_HITS_CONTENT_HEADER: "application/vnd.juniper.sd.policy-hit-count-manager.policy-reference+json;version=1;charset=UTF-8"
    };

    return PolicyHitsConstants;

});