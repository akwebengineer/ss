define([
    '../../../../ui-common/js/common/utils/SmUtil.js'
], function(SmUtil){
    var PreviewConfgConstants= {
        POLICY:"POLICY",
        IPSPOLICY:'IPSPOLICY',
        NAT: "NAT",
        VPN: "VPN",
        DEVICE_PREVIEW_CONF_URL: '/api/juniper/sd/device-management/preview-device-config',
        DEVICE_PREVIEW_CONF_ACCEPT_HEADER: "application/vnd.juniper.sd.fwpolicy-provisioning.monitorable-task-instances+json;version=1;q=0.01",
        DEVICE_PREVIEW_CONF_CONTENT_TYPE_HEADER: "application/vnd.juniper.sd.device-management.update-preview+json;version=1;charset=UTF-8",
        PREVIEW_CONF_DEVICE_LIST_ACCEPT_HEADER: 'application/vnd.juniper.sd.job-management.device-results+json;version=1;q=0.01',
        PREVIEW_CONF_DEVICE_LIST_URL: '/api/juniper/sd/job-management/jobs/#0/device-results',
        XML_CLI_CONF_VIEW_URL: "/api/juniper/sd/configPreview?ejb=SDPreviewManagerEJB&jobid=#0&securityDeviceId=#1&configOnly=true"
    };

    return PreviewConfgConstants;

});
