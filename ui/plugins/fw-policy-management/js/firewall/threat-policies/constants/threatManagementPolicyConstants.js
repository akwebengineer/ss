define([

], function(){
    var ThreatManagementPolicyConstants= {

        TMP_FETCH_URL: "/api/juniper/sd/policy-management/threat-policy-management/threat-policies",
        TMP_ACCEPT_HEADER: 'application/vnd.sd.policy-management.threat-policy-management.threat-policies+json;version=4;q=0.04',
        TMP_JSON_ROOT: "threat-policies.threat-policy",

        TMP_FETCH_CONTENT_TYPE_HEADER: "application/vnd.sd.policy-management.threat-policy-management.threat-policy-ref+json;version=4;charset=UTF-8",
        TMP_FETCH_ACCEPT_HEADER: "application/vnd.sd.policy-management.threat-policy-management.threat-policy+json;version=4;q=0.04"

    };

    return ThreatManagementPolicyConstants;

});
