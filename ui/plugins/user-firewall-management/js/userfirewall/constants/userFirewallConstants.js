/**
 * A module that works with User Firewall Constants.
 *
 * @module userFirewallConstants
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/


define([
], function(){
    var UserFirewallConstants = {

        ACTIVE_DIRECTORY: {
            DEFAULTS: {
                AUTHENTICATION_TIME_OUT: 30,
                WMI_TIME_OUT: 10,
                EVENT_LOG_TIME_SPAN: 1,
                EVENT_LOG_INTERVAL: 10
            },
            DELETE: 'deleteADEvent',
            URL_PATH: '/api/juniper/sd/active-directory-management/active-directories',

            ACCEPT_HEADER:'application/vnd.sd.active-directory-management.active-directories+json;version=2;q=0.02',
            CONTENT_TYPE:'',

            URL_PATH_MODEL: '/api/juniper/sd/active-directory-management/active-directories',
            CONTENT_TYPE_MODEL:'application/vnd.sd.active-directory-management.active-directory+json;version=2;charset=UTF-8',
            ACCEPT_HEADER_MODEL:'application/vnd.sd.active-directory-management.active-directory+json;version=2;q=0.02',
            JSON_ROOT: 'active-directory',

            GRID_JSON_ROOT: 'active-directories.active-directory',


            CAPABILITIES: {
                CREATE: 'createActiveDirectory',
                EDIT: 'modifyActiveDirectory',
                DELETE: 'deleteActiveDirectory',
                DEPLOY: 'deployActiveDirectory'
            },

            DEPLOY_EVENT: 'deployActiveDirectory',

            DOMAIN_CONTROLLER: {
                URL_PATH: '',

                ACCEPT_HEADER:'',
                CONTENT_TYPE:'',
                JSON_ROOT: 'domain-controller',

                GRID_JSON_ROOT: 'domain-controllers.domain-controller'
            },
            DOMAIN_LDAP: {
                URL_PATH: '',

                ACCEPT_HEADER:'',
                CONTENT_TYPE:'',
                JSON_ROOT: 'ldap-address',

                GRID_JSON_ROOT: 'ldap-addresses.ldap-address'
            },
           DEVICE_FETCH_ACCEPT: 'application/vnd.sd.active-directory-management.security-device-refs+json;version=2;q=0.02',
           DEVICE_FETCH_URL: '/api/juniper/sd/active-directory-management/active-directories/{0}/devices',
           CONFIG_VIEW_URL : "/api/juniper/sd/active-directory-management/active-directory-configs/{0}",
           CLI_CONFIG_VIEW_URL : "/api/juniper/sd/active-directory-management/active-directory-configs/{0}?cli=true",
           DEPLOY_URL: "/api/juniper/sd/active-directory-management/active-directories/{0}/deploy",
           DEPLOY_ACCEPT:"application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.02",
           DEPLOY_CONTENT_TYPE:"application/vnd.sd.active-directory-management.do-deploy-request+json;version=2;charset=UTF-8"
        },
        ACCESS_PROFILE: {
            DELETE: 'deleteAPEvent',
            URL_PATH: "/api/juniper/sd/access-profile-management/access-profiles",
            ACCEPT: 'application/vnd.sd.access-profile-management.access-profiles+json;version=1;q=0.01',
            ACCEPT_HEADER: 'application/vnd.sd.access-profile-management.access-profile+json;version=1;q=0.01',
            CONTENT_TYPE: 'application/vnd.sd.access-profile-management.access-profile+json;version=1;charset=UTF-8',
            JSON_ROOT: 'access-profiles.access-profile',
            JSON_ROOT1: 'access-profiles',
            JSON_ROOT2: 'access-profile',
            CAPABILITIES: {
                CREATE: 'createAccessProfile',
                EDIT: 'modifyAccessProfile',
                DELETE: 'deleteAccessProfile',
                DEPLOY: 'deployAccessProfile'
            },
            AUTHENTICATION_ORDER:{
                NONE: "NONE",
                LDAP: "LDAP",
                PASSWORD: "Password",
                RADIUS: "Radius",
                SECUREID:"Secure ID"
            },
           DEVICE_FETCH_ACCEPT: 'application/vnd.sd.access-profile-management.devices+json;version=1;q=0.01',
           DEVICE_FETCH_URL: '/api/juniper/sd/access-profile-management/access-profiles/{0}/devices',
           CONFIG_VIEW_URL : "/api/juniper/sd/access-profile-management/access-profiles/{0}/preview?device-id={1}",
           CLI_CONFIG_VIEW_URL : "/api/juniper/sd/access-profile-management/access-profiles/{0}/preview?cli=true&device-id={1}",
           DEPLOY_URL: "/api/juniper/sd/access-profile-management/access-profiles/{0}/deploy",
           DEPLOY_ACCEPT:"application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01",
           DEPLOY_CONTENT_TYPE:"application/vnd.sd.access-profile-management.deploy-request+json;version=1;charset=UTF-8"
        },
        DELETE: {
            URL: "/delete?delete-from-device=",
            ACCEPT: 'application/vnd.net.juniper.space.job-management.task+json;version=1;q=0.01'
        }
    };

    return UserFirewallConstants;

});
