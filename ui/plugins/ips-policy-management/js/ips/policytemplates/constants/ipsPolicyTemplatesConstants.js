define([

], function(){
    var IpsPolicyTemplatesConstant = {        
        IPS_POLICY_TEMPLATE_URL : "/api/juniper/sd/policy-management/ips/policy-templates",
        IPS_POLICY_TEMPLATE_DELETE_URL : "/api/juniper/sd/policy-management/ips/policy-templates/delete",
        DELETE_CONTENT_HEADER : "application/vnd.juniper.sd.policy-management.policy-templates.delete+json;version=3;charset=UTF-8",
        IPS_POLICY_TEMPLATES_ACCEPT_HEADER : "application/vnd.juniper.sd.policy-management.ips.policy-templates+json;version=3;q=0.03",
        IPS_POLICY_TEMPLATE_ACCEPT_HEADER : "application/vnd.juniper.sd.policy-management.ips.policy-template+json;version=3;q=0.03",
        IPS_POLICY_TEMPLATE_CONTENT_TYPE : "application/vnd.juniper.sd.policy-management.ips.policy-template+json;version=3;charset=UTF-8",
        IPS_POLICY_TEMPLATE_CLONE_ACCEPT : "application/vnd.juniper.sd.policy-management.ips.policy-template.clone-response+json;version=3;q=0.03",
        POLICY_MIME_TYPE: 'vnd.juniper.net.ips.policy-templates',
        getClonePolicyTemplateURL : function(policyId) {
            return "/api/juniper/sd/policy-management/ips/policy-templates/"+policyId+"/clone";
        }
    };

    return IpsPolicyTemplatesConstant;

});
