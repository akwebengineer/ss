/**
 * Form configuration required to render the general form using the FormWidget.
 *
 * @module General Form Configuration for access profile General Settings
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['../../constants/userFirewallConstants.js'], function (Constants) {

    var NAME_MAX_LENGTH = 63,
        NAME_MIN_LENGTH = 1,
        DESCRIPTION_MAX_LENGTH = 255;
    /**
     *
     * @param context
     * @constructor
     */
    var Configuration = function(context) {
        /**
         * get Name element base on create/edit mode
         * @param editMode
         * @returns {element}
         */
        this.getNameElement = function(editMode){

            if(editMode){
                return {
                    "element_description": true,
                    "id": "access_profile_name",
                    "value": "{{name}}",
                    "label": context.getMessage('access_profile_name'),
                    "name": "name"
                }
            } else {
                return {
                    "element_multiple_error": true,
                    "id": "access_profile_name",
                    "name": "name",
                    "value": "{{name}}",
                    "label": context.getMessage('access_profile_name'),
                    "field-help": {
                        "content": context.getMessage('access_profile_name_tooltip')
                    },
                    "required": true,
                    "pattern-error": [
                        {
                            "pattern": "validtext",
                            "error": context.getMessage('name_require_error')
                        },
                        {
                            "pattern": "length",
                            "max_length": NAME_MAX_LENGTH,
                            "min_length": NAME_MIN_LENGTH,
                            "error": context.getMessage("maximum_length_error", [NAME_MAX_LENGTH])
                        },
                        {
                            "regexId": "regex1",
                            "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_.:\/]{0,62}$",
                            "error": context.getMessage('access_profile_name_error')
                        }
                    ],
                    "error":  context.getMessage('access_profile_name_error'),
                    "notshowvalid": true
                };
            }

        };
        /**
         *
         * @returns {{form_id: string, form_name: string, add_remote_name_validation: string, sections: *[]}}
         */
        this.getValues = function(editMode) {

            return {
                "form_id": "access_profile_general_form",
                "form_name": "access_profile_general_form",
                "add_remote_name_validation": 'access_profile_name',
                "title-help": {
                    "content": context.getMessage('access_profile_create_view_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("ACCESS_PROFILE_CREATING")
                },
                "sections": [{
                    "elements": [
                        this.getNameElement(editMode),
                        {
                            "element_textarea": true,
                            "id": "access_profile_description",
                            "name": "description",
                            "value": "{{description}}",
                            "label": context.getMessage('description'),
                            "max_length": DESCRIPTION_MAX_LENGTH,
                            "post_validation": "lengthValidator",
                            "error" : context.getMessage('access_profile_description_validation'),
                            "field-help": {
                                "content": context.getMessage('access_profile_description_tooltip')
                            }
                        }
                    ]
                },
                {
                    "heading": context.getMessage('access_profile_authentication_order'),
                    "elements": [{
                        "element_dropdown": true,
                        "id": "access_profile_authentication_order1",
                        "name": "authentication-order1",
                        initValue: '{{authentication_order1}}',
                        "enableSearch": true,
                        "allowClearSelection": false,
                        "field-help": {
                            "content": context.getMessage('access_profile_order1_tooltip')
                        },
                        "label": context.getMessage('access_profile_authentication_order1'),
                        "data": [{
                                "id": "NONE",
                                "text": Constants.ACCESS_PROFILE.AUTHENTICATION_ORDER.NONE
                            },
                            {
                                "id": "LDAP",
                                "text":Constants.ACCESS_PROFILE.AUTHENTICATION_ORDER.LDAP
                            },
                            {
                                "id": "PASSWORD",
                                "text":Constants.ACCESS_PROFILE.AUTHENTICATION_ORDER.PASSWORD
                            },
                            {
                                "id": "RADIUS",
                                "text": Constants.ACCESS_PROFILE.AUTHENTICATION_ORDER.RADIUS
                            },
                            {
                                "id": "SECURID",
                                "text": Constants.ACCESS_PROFILE.AUTHENTICATION_ORDER.SECUREID
                            }
                        ]
                    },
                    {
                        "element_dropdown": true,
                        "id": "access_profile_authentication_order2",
                        "name": "authentication-order2",
                        initValue: '{{authentication_order2}}',
                        'class': 'access_profile_authentication_order2 hide',
                        "enableSearch": true,
                        "allowClearSelection": false,
                        "field-help": {
                            "content": context.getMessage('access_profile_order2_tooltip')
                        },
                        "label": context.getMessage('access_profile_authentication_order2'),
                        "data": [   ]
                    }]
                },
                {
                    "heading": context.getMessage('access_profile_ldap_server_title'),
                    "elements": [
                        {
                            "element_description": true,
                            "class":"access_profile_ldap_server",
                            "id": "access_profile_ldap_server",
                            "name": "access_profile_ldap_server"
                        }
                    ]
                }]
            };
        };
    };

    return Configuration;
});