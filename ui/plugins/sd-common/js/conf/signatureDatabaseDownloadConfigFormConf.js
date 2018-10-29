/**
 * A configuration object with the parameters required to build
 * a form for download configuration view
 *
 * @module signatureDatabaseDownloadConfigFormConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {
    var HOSTNAME_MAX_LENGTH = 63,
        HOSTNAME_MIN_LENGTH = 1,
        PORT_MIN = 1,
        PORT_MAX = 65535,
        USERNAME_MAX_LENGTH = 255,
        USERNAME_MIN_LENGTH = 1,
        PASSWORD_MAX_LENGTH = 255,
        PASSWORD_MIN_LENGTH = 1,
        // Pattern for host name must be a string that begins with an alphanumeric character, special characters (-) are allowed, cannot exceed 63 characters;
        // or a valid IPv4 address (1.2.3.4) or a valid FQDN
        HOSTNAME_PATTERN = "^("
            + "([a-zA-Z][a-zA-Z0-9-]{0,62})"
            + "|"
            + "((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))"
            + "|"
            + "((?=.{1,254}$)((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63})"
            + ")$";

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "signature-database-download-config-form",
                "form_name": "signature-database-download-config-form",
                "title": context.getMessage('signature_database_download_config_title'),
                "title-help": {
                    "content": context.getMessage('signature_database_download_config_intro'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("SIGNATURE_DATABASE_DOWNLOADING")
                },
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "signature-database-download-summary",
                        "elements": [
                            {
                                "element_url": true,
                                "id": "signature-database-download-url",
                                "name": "url",
                                "label": context.getMessage('signature_database_download_config_url'),
                                "error": context.getMessage('signature_database_download_config_url_error'),
                                "value": "{{download_url}}",
                                "field-help": {
                                    "content": context.getMessage('signature_database_download_config_url_tooltip')
                                },
                                "required": true
                            },{
                              "element_file": true,
                              "id": "ips-server-certificate-upload-box",
                              "name": "ips-server-certificate-upload-box",
                              "label": context.getMessage('signature_database_server_certificate_upload_box_label'),
                              "placeholder": context.getMessage('signature_database_server_certificate_upload_box_placeholder'),
                              "fileupload_button_label": context.getMessage('browse'),
                              "field-help": {
                                  "content": context.getMessage('signature_database_server_certificate_upload_box_tooltip')
                              }
                          },{
                                "element_checkbox": true,
                                "id": "signature-database-delta-download",
                                "label": context.getMessage('signature_database_download_delta_download'),
                                "values": [{
                                    "id": "signature-database-delta-download-enable",
                                    "name": "delta-download-enable",
                                    "label": context.getMessage('checkbox_enable'),
                                    "value": "enable"
                                }]
                            }
                        ]
                    },
                    {
                        "section_id": "signature-database-download-server-proxy-section",
                        "heading": context.getMessage('signature_database_download_config_proxy_server_title'),
                        "elements": [
                             {
                                 "element_checkbox": true,
                                 "id": "signature-database-download-server-proxy",
                                 "label": context.getMessage('signature_database_download_server_proxy_label'),
                                 "field-help": {
                                     "content": context.getMessage('signature_database_download_server_proxy_tooltip')
                                 },
                                 "values": [
                                     {
                                         "id": "signature-database-download-server-proxy-enable",
                                         "name": "server-proxy-enable",
                                         "label": context.getMessage('checkbox_enable'),
                                         "value": "enable"
                                     }
                                 ]
                             },
                             {
                                 "element_text": true,
                                 "id": "signature-database-download-server-proxy-hostname",
                                 "name": "hostname",
                                 "label": context.getMessage('signature_database_download_server_proxy_hostname'),
                                 "class": "signature-database-download-server-proxy-settings",
                                 "pattern": HOSTNAME_PATTERN,
                                 "error": context.getMessage('signature_database_download_server_proxy_error_allowed_chars_host_name')
                             },
                             {
                                 "element_number": true,
                                 "id": "signature-database-download-server-proxy-hostport",
                                 "name": "hostport",
                                 "label": context.getMessage('signature_database_download_server_proxy_hostport'),
                                 "class": "signature-database-download-server-proxy-settings",
                                 "min_value":PORT_MIN,
                                 "max_value":PORT_MAX,
                                 "placeholder": "",
                                 "error": context.getMessage('signature_database_download_server_proxy_error_port', [PORT_MIN, PORT_MAX])
                             },
                             {
                                 "element_multiple_error": true,
                                 "id": "signature-database-download-server-proxy-username",
                                 "name": "username",
                                 "label": context.getMessage('signature_database_download_server_proxy_username'),
                                 "pattern-error": [
                                      {
                                          "pattern": "length",
                                          "max_length": USERNAME_MAX_LENGTH,
                                          "min_length": USERNAME_MIN_LENGTH,
                                          "error": context.getMessage("maximum_length_error", [USERNAME_MAX_LENGTH])
                                      },
                                      {
                                          "pattern": "validtext",
                                          "error": context.getMessage('name_require_error')
                                      }
                                 ],
                                 "error": true,
                                 "notshowvalid": true,
                                 "class": "signature-database-download-server-proxy-settings"
                             },
                             {
                                 "element_password": true,
                                 "id": "signature-database-download-server-proxy-password",
                                 "name": "password",
                                 "label": context.getMessage('signature_database_download_server_proxy_password'),
                                 "pattern-error": [
                                      {
                                          "pattern": "length",
                                          "max_length": PASSWORD_MAX_LENGTH,
                                          "min_length": PASSWORD_MIN_LENGTH,
                                          "error": context.getMessage("maximum_length_error", [PASSWORD_MAX_LENGTH])
                                      },
                                      {
                                          "pattern": "validtext",
                                          "error": context.getMessage('name_require_error')
                                      }
                                 ],
                                 "error": true,
                                 "notshowvalid": true,
                                 "class": "signature-database-download-server-proxy-settings"
                             }
                         ]
                    },
                    {
                        "section_id": "signature-database-download-scheduler-section",
                        "section_class": "scheduler_section",
                        "elements": []
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "signature-database-download-config-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "signature-database-download-config-save",
                        "name": "download",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});
