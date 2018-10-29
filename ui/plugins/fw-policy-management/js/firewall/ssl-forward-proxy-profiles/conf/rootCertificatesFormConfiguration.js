/**
 * A configuration object with the parameters required to build
 * a view for sslForwardProxyProfile root certificates
 *
 * @module rootCertificatesFormConfiguration
 * @author vinayms@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 */
define([
], function () {

    var Configuration = function (context) {

        this.getValues = function () {

            return {
                "form_id": "ssl-root-certificate-form",
                "form_name": "ssl-root-certificate-form",
                "on_overlay": true,
                "title": context.getMessage('ssl_forward_proxy_policy_root_certificate'),
                "title-help": {
                    "content": context.getMessage('sslForwardProxyProfile_add_root_certificate_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "sections": [
                    {
                        "elements": [
                           {
                                "element_description": true,
                                "id": "sd-ssl-form-root-certificate-devices",
                                "class": "sd-ssl-form-root-certificate-devices",
                                "name": "security-device-name",
                                "required": true,
                                "label": context.getMessage('ssl_rootcertificate_column_devices')
                            },
                            {
                                "element_dropdown": true,
                                "id": "sd-ssl-form-root-certificate-certificates",
                                "name": "root_certificate",
                                "initValue": "{{root_certificate}}",
                                "values": [{"value": "", "label": "None" }],
                                "required": true,
                                "label": context.getMessage('ssl_forward_proxy_policy_root_certificate')
                            },
                            {
                                "element_radio": true,
                                "class": "numbered",
                                "id": "ssl_rootcertificate_column_trusted_cs",
                                "label": context.getMessage('ssl_rootcertificate_column_trusted_cs'),
                                "field-help": {
                                    "content": context.getMessage('sslForwardProxyProfile_trusted_certificate_tooltip'),
                                    "ua-help-identifier": "alias_for_ua_event_binding"
                                },
                                "values": [
                                    {
                                        "id": "trusted_cs_id",
                                        "name": "ssl_fp_root_certicicates_trusted_cs",
                                        "label": context.getMessage("ssl_fp_root_certificate_form_radio_label_all"),
                                        "value": "ALL",
                                        "checked": true
                                    },
                                    {
                                        "id": "trusted_cs_id",
                                        "name": "ssl_fp_root_certicicates_trusted_cs",
                                        "label": context.getMessage("ssl_fp_root_certificate_form_radio_label_specify_values"),
                                        "value": "SPECIFY_VALUE",
                                        "checked": false
                                    }
                                ]
                            },
                            {
                                "element_description": true,
                                "class":"list-builder sd-ssl-form-root-certificate-trusted-cas hide",
                                "id": "sd-ssl-form-root-certificate-trusted-cas",
                                "label": "",
                                "name": "trusted-ca"
                                
                            }
                        ]
                    }

                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "root_certificate_cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "root_certificate_save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            }


        };
    };

    return Configuration;
})
;