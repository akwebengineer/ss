/**
 * Form configuration required to render the settings form using the FormWidget.
 *
 * @module ActiveDirectorySettingsFormConf
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {

    var Configuration = function (context) {

        /**
         * @returns Form configuration
         *
         */
        this.getValues = function () {

            return {
                'form_id': 'active-directory-settings-form',
                'form_name': 'active-directory-settings-form',
                'sections': [{
                    section_id: 'on-demand',
                    'elements': [{
                        "element_description": true,
                        "class":"active_directory_domain_settings",
                        "id": "active_directory_domain_settings",
                        "name": "active_directory_domain_settings"
                    }]
                }]
            };
        };
    };

    return Configuration;
});