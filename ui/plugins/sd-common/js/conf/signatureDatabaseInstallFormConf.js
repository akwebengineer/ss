/**
 * A configuration object with the parameters required to build
 * a form for install view
 *
 * @module signatureDatabaseInstallFormConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {
    var DATE_FORMAT_LABEL = 'MM/DD/YYYY',
        DATE_FORMAT = 'mm/dd/yyyy';

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "signature-database-install-form",
                "form_name": "signature-database-install-form",
                "title": context.getMessage('signature_database_install_title'),
                "title-help": {
                    "content": context.getMessage('signature_database_install_intro'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("SIGNATURE_DATABASE_INSTALLING")
                },
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "signature-database-signature-summary",
                        "heading": context.getMessage('signature_database_signature_summary'),
                        "progressive_disclosure": "expanded",
                        "elements": [
                             {
                                 "element_description": true,
                                 "id": "signature-database-install-version",
                                 "label": context.getMessage('signature_database_install_version'),
                                 "field-help": {
                                     "content": context.getMessage('signature_database_install_version_tooltip')
                                 },
                                 "value": "{{version-no}}"
                             },
                             {
                                 "element_description": true,
                                 "id": "signature-database-supported-platform",
                                 "label": context.getMessage('signature_database_supported_platform'),
                                 "field-help": {
                                     "content": context.getMessage('signature_database_supported_platform_tooltip')
                                 },
                                 "value": "{{supported-platform}}"
                             }
                         ]
                    },
                    {
                        "section_id": "signature-database-device-list",
                        "elements": []
                    },
                    {
                        "section_id": "signature-database-incremental-update-section",
                        "elements": [
                             {
                                 "element_checkbox": true,
                                 "id": "signature-database-incremental-update-section",
                                 "label": context.getMessage('signature_database_enable_incremental_update'),
                                 "field-help": {
                                     "content": context.getMessage('signature_database_enable_incremental_update_tooltip'),
                                     "ua-help-identifier": "signature-database-enable-incremental-update-tooltip"
                                 },
                                 "values": [
                                     {
                                         "id": "signature-database-enable-incremental-update",
                                         "name": "signature-database-enable-incremental-update",
                                         "label": context.getMessage('checkbox_enable'),
                                         "value": "enable",
                                         "checked": true
                                     }
                                 ]
                             }
                        ]
                    },
                    {
                        "section_id": "signature-database-install-scheduler-section",
                        "section_class": "scheduler_section",
                        "elements": []
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "signature-database-install-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "signature-database-install-save",
                        "name": "install",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});