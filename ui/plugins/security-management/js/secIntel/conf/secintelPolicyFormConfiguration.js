/**
 * A configuration object with the parameters required to build
 * a form for security intelligence policy
 *
 * @module SecintelPolicyFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  'text!../../../../sd-common/js/templates/secintelPolicyCustomAddressList.html'
], function (customAddressListTemplate) {

    var NAME_MAX_LENGTH = 63,
        NAME_MIN_LENGTH = 1;

    var Configuration = function(context) {

        var customAddressListFormatter = function() {
            var customAddressList = {
                    'list': [
                        {
                            'value': context.getMessage('secintel_policy_global_white_list'),
                            'id': 'secintel-policy-global-white-list',
                            'view': context.getMessage('secintel_policy_view')
                        },{
                            'value': context.getMessage('secintel_policy_global_black_list'),
                            'id': 'secintel-policy-global-black-list',
                            'view': context.getMessage('secintel_policy_view')
                        }
                    ]
            };
            // Render template
            return Slipstream.SDK.Renderer.render(customAddressListTemplate, customAddressList);
        };

        this.getValues = function() {

            return {
                "form_id": "secintel-policy-form",
                "form_name": "secintel-policy-form",
                "on_overlay": true,
                "add_remote_name_validation": 'secintel-policy-name',
                "sections": [
                    {
                         "elements": [
                            {
                                "element_multiple_error": true,
                                "id": "secintel-policy-name",
                                "name": "name",
                                "label": context.getMessage('name'),
                                "required": true,
                                "pattern-error": [
                                    {
                                        "pattern": "length",
                                        "max_length": NAME_MAX_LENGTH,
                                        "min_length": NAME_MIN_LENGTH,
                                        "error": context.getMessage("maximum_length_error", [NAME_MAX_LENGTH])
                                    },
                                    {
                                        "pattern": "validtext",
                                        "error": context.getMessage('name_require_error')
                                    }
                                ],
                                "error": true,
                                "notshowvalid": true,
                                "help": context.getMessage("maximum_length_help", [NAME_MAX_LENGTH])
                            },
                            {
                                "element_textarea": true,
                                "id": "secintel-policy-description",
                                "name": "description",
                                "label": context.getMessage('description'),
                                "required": false
                            }
                        ]
                    },
                    {
                        "heading": context.getMessage('secintel_policy_profiles'),
                        "progressive_disclosure": "expanded",
                        "elements": [
                            {
                                "element_dropdown": true,
                                "id": "secintel-policy-profile-commandandcontrol",
                                "name": "secintel-policy-profile-commandandcontrol",
                                "label": context.getMessage('secintel_profile_category_commandandcontrol'),
                                "values": [
                                   {
                                       "label": context.getMessage('none'),
                                       "value": ""
                                   }
                               ]
                            },
                            {
                                "element_dropdown": true,
                                "id": "secintel-policy-profile-webappsecure",
                                "name": "secintel-policy-profile-webappsecure",
                                "label": context.getMessage('secintel_profile_category_webappsecure'),
                                "values": [
                                   {
                                       "label": context.getMessage('none'),
                                       "value": ""
                                   }
                               ]
                            }
                        ]
                    },
                    {
                        "elements": [
                            {
                                "element_description": true,
                                "id": "secintel-policy-custom-address-list",
                                "label": context.getMessage('secintel_profile_category_customaddress'),
                                "value": customAddressListFormatter
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "secintel-policy-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "secintel-policy-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});