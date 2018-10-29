/**
 * A configuration object with the parameters required to build
 * Supply feature related configuration to view
 *
 * @module AssignToDomainFeatureRelatedConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {
    var ADDRESS_MIME_TYPE = 'vnd.juniper.net.addresses',
        SERVICE_MIME_TYPE = 'vnd.juniper.net.services',
        VARIABLE_MIME_TYPE = 'vnd.juniper.net.variables',
        UTM_POLICY_MIME_TYPE = 'vnd.juniper.net.utm-policy',
        WEB_FILTERING_MIME_TYPE = 'vnd.juniper.net.web-filtering',
        URL_PATTERN_MIME_TYPE = 'vnd.juniper.net.utm-url-patterns',
        URL_CATEGORY_MIME_TYPE = 'vnd.juniper.net.utm-url-category',
        ANTISPAM_MIME_TYPE = 'vnd.juniper.net.utm-antispam',
        ANTIVIRUS_MIME_TYPE = 'vnd.juniper.net.utm-antivirus',
        CONTENT_FILTERING_MIME_TYPE = 'vnd.juniper.net.content-filtering',
        DEVICE_PROFILE_MIME_TYPE = 'vnd.juniper.net.utm-device',
        SCHEDULER_MIME_TYPE = 'vnd.juniper.net.schedulers',
        PORT_SET_MIME_TYPE = 'vnd.juniper.net.nat.portsets',
        NAT_POOLS_MIME_TYPE = 'vnd.juniper.net.nat.natpools',
        FIREWALL_POLICY_PROFILE_MIME_TYPE = 'vnd.juniper.net.firewall.policy-profiles',
        NAT_POLICY_MIME_TYPE = 'vnd.juniper.net.nat.policies',
        IPS_POLICY_MIME_TYPE = 'vnd.juniper.net.ips.policies',
        FIREWALL_POLICY_MIME_TYPE = 'vnd.juniper.net.firewall.policies',
        VPN_POLICY_MIME_TYPE = 'vnd.juniper.net.vpn.vpn-profiles';

    var Configuration = function(context) {

        this.getDataForAssignToDomain = function(mimeType) {
            var data = {};
            switch(mimeType) {
                case ADDRESS_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/address-management/address/assign-to-domain';
                    data.objectTypeText = context.getMessage('address_type_text');
                    break;

                case SERVICE_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/service-management/service/assign-to-domain';
                    data.objectTypeText = context.getMessage('service_type_text');
                    break;

                case VARIABLE_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/variable-management/variable-definition/assign-to-domain';
                    data.objectTypeText = context.getMessage('variable_type_text');
                    break;

                case UTM_POLICY_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/utm-management/utm-policy/assign-to-domain';
                    data.objectTypeText = context.getMessage('utm_policy_type_text');
                    break;

                case WEB_FILTERING_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/utm-management/web-filtering-profile/assign-to-domain';
                    data.objectTypeText = context.getMessage('web_filtering_type_text');
                    break;

                case URL_PATTERN_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/utm-management/url-pattern/assign-to-domain';
                    data.objectTypeText = context.getMessage('url_pattern_type_text');
                    break;

                case URL_CATEGORY_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/utm-management/url-category-list/assign-to-domain';
                    data.objectTypeText = context.getMessage('url_category_type_text');
                    break;

                case ANTISPAM_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/utm-management/anti-spam-profile/assign-to-domain';
                    data.objectTypeText = context.getMessage('antispam_type_text');
                    break;

                case ANTIVIRUS_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/utm-management/anti-virus-profile/assign-to-domain';
                    data.objectTypeText = context.getMessage('antivirus_type_text');
                    break;

                case CONTENT_FILTERING_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/utm-management/content-filtering-profile/assign-to-domain';
                    data.objectTypeText = context.getMessage('content_filtering_type_text');
                    break;

                case DEVICE_PROFILE_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/utm-management/utm-device-profile/assign-to-domain';
                    data.objectTypeText = context.getMessage('device_profile_type_text');
                    break;

                case SCHEDULER_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/scheduler-management/scheduler/assign-to-domain';
                    data.objectTypeText = context.getMessage('schedulers_type_text');
                    break;

                case NAT_POOLS_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/nat-pool-management/nat-pool/assign-to-domain';
                    data.objectTypeText = context.getMessage('nat_pools_type_text');
                    break;
                
                case PORT_SET_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/portset-management/port-set/assign-to-domain';
                    data.objectTypeText = context.getMessage('port_sets_type_text');
                    break;
                
                case FIREWALL_POLICY_PROFILE_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/fwpolicy-management/policy-profile/assign-to-domain';
                    data.objectTypeText = context.getMessage('firewall_policy_Profile_type_text');
                    break;
                
                case NAT_POLICY_MIME_TYPE: 
                    data.assign_to_domain_url = '/api/juniper/sd/nat-policy-management/nat/policy/assign-to-domain';
                    data.objectTypeText = context.getMessage('nat_policy_type_text');
                    break;
                
                case IPS_POLICY_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/ips-policy-management/ips/policy/assign-to-domain';
                    data.objectTypeText = context.getMessage('ips_policy_type_text');
                    break;

                case FIREWALL_POLICY_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/fwpolicy-management/firewall-policy/assign-to-domain';
                    data.objectTypeText = context.getMessage('firewall_policies_type_text');
                    break;

                case VPN_POLICY_MIME_TYPE:
                    data.assign_to_domain_url = '/api/juniper/sd/vpn-management/vpn-profile/assign-to-domain';
                    data.objectTypeText = context.getMessage('ipsec_vpns_tunnels_column_profile');
                    break;
            }
            return data;
        };
    };

    return Configuration;
});