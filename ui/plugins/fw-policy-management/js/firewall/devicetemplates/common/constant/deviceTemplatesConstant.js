define([

], function(){
    var DeviceTemplatesConstant = {
        //getAll config-templates API picks up currentdomain from session context, passing 0 to avoid bad requrest.
        DEVICE_TEMPLATE_URL_DOMAIN : "/api/space/config-template-management/config-templates?domainContext=(currentDomainId eq 0 and accessMode eq CONTAINER)",
        DEVICE_TEMPLATE_URL :"/api/space/config-template-management/config-templates",
        DEVICE_TEMPLATE_ACCEPT_HEADER : "application/vnd.net.juniper.space.config-template-management.config-templates+json;q=0.01;version=1",
        DEVICE_TEMPLATE_CREATE_ACCEPT_HEADER : "application/vnd.net.juniper.space.config-template-management.config-template+json;q=0.01;version=1",
        DEVICE_TEMPLATE_CONTENT_HEADER : "application/vnd.net.juniper.space.config-template-management.config-template+json;version=1;charset=UTF-8",
   
   		OS_VERSION_URL: "/api/juniper/sd/fwpolicy-management/os-versions?device-family=junos-es",
        OS_VERSION_ACCEPT_HEADER: "application/vnd.juniper.sd.fwpolicy-management.os-versions+json;version=1;q=0.01",
        TEMPLATE_CREATION_CONTENT_TYPE: "application/vnd.net.juniper.space.config-template-management.quick-template-basic-info+json;version=2;charset=UTF-8",
        TEMPLATE_CONFIG_ACCEPT_HEADER: "application/vnd.net.juniper.space.config-template-management.configuration-update-result+json;version=2",
        TEMPLATE_CONFIG_CONTENT_TYPE: "application/vnd.net.juniper.space.config-template-management.configuration-cli-request+json;version=2;charset=UTF-8",
        TEMPLATE_VALIDATION_CONTENT_TYPE:"application/vnd.net.juniper.space.config-template-management.validate-quick-template-config-cli-request+json;version=2;charset=UTF-8",
        TEMPLATE_GET_CONFIG_CONTENT_TYPE: "application/vnd.net.juniper.space.config-template-management.configuration-cli+json;q=0.02;version=2",
        TEMPLATE_DELETE_CONFIG_CONTENT_TYPE: "application/json",
        TEMPLATE_CREATE_CONFIG_CONTENT_TYPE: "application/vnd.net.juniper.space.config-template-management.create-quick-template-request+json;version=2;charset=UTF-8",
        TEMPLATE_CREATE_CONFIG_URL: "/api/space/config-template-management/create-quick-template",
        TEMPLATE_DELETE_FINAL_URL: "/api/space/config-template-management/config-templates/deleteTemplateWithVersions",
        TEMPLATE_DELETE_FINAL_CONTENT_TYPE: "application/vnd.net.juniper.space.config-template-management.delete-config-template-with-versions-request+json;version=3;charset=UTF-8",
        TEMPLATE_SHOW_DETAILS_ACCEPT_TYPE:"application/vnd.net.juniper.space.config-template-management.template-config-cli+json;q=0.02;version=2",
        TEMPLATE_SHOW_DETAILS_CONTENT_TYPE:"application/vnd.net.juniper.space.config-template-management.template-config-cli+json;q=0.02;version=2",
        TEBLE_HEIGHT: "auto"

    };

    return DeviceTemplatesConstant;

});
