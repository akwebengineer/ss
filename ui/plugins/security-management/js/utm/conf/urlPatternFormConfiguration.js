/**
 * A configuration object with the parameters required to build
 * a form for url pattern
 *
 * @module urlPatternFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'text!../templates/utmUrlPatternUrlListHelp.html'
], function (UrlListHelpTemplate) {

    var NAME_MAX_LENGTH = 29,
        NAME_MIN_LENGTH = 1;

    var Configuration = function(context) {
        var DESCRIPTION_MAX_LENGTH = 255;

        this.getValues = function() {

            return {
                "form_id": "utm-urlpattern-form",
                "form_name": "utm-urlpattern-form",
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage('utm_url_patterns_create_view_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("UTM_URL_PATTERN_CREATING")
                },
                "add_remote_name_validation": 'utm-urlpattern-name',
                "sections": [
                    {
                        //"heading_text": context.getMessage('utm_url_patterns_title_general_information'),
                        "elements": [
                            {
                                "element_multiple_error": true,
                                "id": "utm-urlpattern-name",
                                "name": "name",
                                "value": "{{name}}",
                                "label": context.getMessage('name'),
                                "notshowvalid": true,
                                "field-help": {
                                    "content": context.getMessage('utm_url_patterns_name_tooltip')
                                },
                                "required": true,
                                "error": true,
                                "pattern-error": [
                                    {
                                        "pattern": "validtext",
                                        "error": context.getMessage('name_require_error')
                                    },
                                    {
                                        "regexId": "regex1",
                                        "pattern": "^[a-zA-Z_][a-zA-Z0-9-_]{0,28}$",
                                        "error": context.getMessage('utm_url_name_error', [NAME_MAX_LENGTH])
                                    }
                                ]
                            },
                            {
                                "element_textarea": true,
                                "id": "utm-urlpattern-description",
                                "name": "description",
                                "value": "{{description}}",
                                "field-help": {
                                    "content": context.getMessage('utm_url_patterns_description_tooltip')
                                },
                                "max_length": DESCRIPTION_MAX_LENGTH,
                                "post_validation": "lengthValidator",
                                "label": context.getMessage('description'),
                                "required": false
                            },
                            {
                                "element_textarea": true,
                                "id": "utm-urlpattern-addurl",
                                "name": "addurl",
                                "label": context.getMessage('utm_url_patterns_column_add_url'),
                                "required": false,
                                "field-help": {
                                    "content": context.getMessage('utm_url_patterns_add_url_tooltip')
                                },
                                "help": context.getMessage('utm_url_patterns_add_url_help'),
                                "inlineButtons":[{
                                    "id": "utm-urlpattern-addurl-to-grid",
                                    "class": "input_button",
                                    "name": "input_button",
                                    "value": context.getMessage("utm_url_patterns_add_button")
     
                                }]
                            }
                        ]
                   }, {
                        "section_id": "url-list-grid",
                        "elements": [
                            {
                                "element_description": true,
                                "id": "utm-urlpattern-url-list",
                                "name": "utm-urlpattern-url-list",
                                "label": "",
                                "class": "grid-widget"
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "utm-urlpattern-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "utm-urlpattern-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});
