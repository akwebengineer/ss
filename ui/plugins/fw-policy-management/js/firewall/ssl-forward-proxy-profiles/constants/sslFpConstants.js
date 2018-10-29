define([

], function(){
    var SslFpConstants= {
        
        FETCH_CUSTOM_CIPHERS_URL:'/api/juniper/sd/device-management/custom-ciphers',
        FETCH_CUSTOM_CIPHERS_ACCEPT_HEADER:'application/vnd.juniper.sd.device-management.custom-ciphers+json;version=2;q=0.02',
        ROOT_CERTIFICATE_DEVICES_URL: "/api/juniper/sd/ssl-forward-proxy-profile-management/devices?sortby=(name(ascending))",
        ROOT_CERTIFICATE_DEVICES_ACCEPT_HEADER: "application/vnd.juniper.sd.ssl-forward-proxy-profile-management.devices+json;version=2;q=0.02",
        SSL_FP_FETCH_URL: "/api/juniper/sd/ssl-forward-proxy-profile-management/ssl-forward-proxy-profiles",
        SSL_FP_FETCH_ACCEPT_HEADER: "application/vnd.juniper.sd.ssl-forward-proxy-profile-management.ssl-forward-proxy-profiles+json;version=2",
        SSL_FP_JSON_ROOT: "ssl-forward-proxy-profiles.ssl-forward-proxy-profile",
        DEVICE_CERTIFICATES_URL: "/api/juniper/sd/device-management/device-certificates",
        DEVICE_CERTIFICATES_ACCEPT_HEADER: "application/vnd.juniper.sd.device-management.certificates+json;version=2;q=0.02",
        DEVICE_CERTIFICATES_CONTENT_TYPE_HEADER: "application/vnd.juniper.sd.device-management.certificates-request+json;version=2;charset=UTF-8",
        PROFILE_FETCH_CONTENT_TYPE_HEADER: "application/vnd.juniper.sd.ssl-forward-proxy-profile-management.ssl-forward-proxy-profile+json;version=2;charset=UTF-8",
        PROFILE_FETCH_ACCEPT_HEADER: "application/vnd.juniper.sd.ssl-forward-proxy-profile-management.ssl-forward-proxy-profile+json;version=2",
        TRUSTED_CAS_ACCEPT_HEADER: "application/vnd.juniper.sd.device-management.trustedcas+json;version=2;q=0.02"
    };

    return SslFpConstants;

});
