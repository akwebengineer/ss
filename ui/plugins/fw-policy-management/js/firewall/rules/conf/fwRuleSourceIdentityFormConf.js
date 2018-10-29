/**
 * A configuration object with the parameters required to build 
 * a form for source identities
 *
 * @module sourceIdentityConfiguration
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
], function () {
    var Configuration = function(context) {
        this.getValues = function() {
            return {
                "title": context.getMessage('source_identity_add'),
                "form_id": "source-id-create-form",
                "form_name": "source-id-create-form",
                "on_overlay": true,
                "add_remote_name_validation": 'source-id-name',
                "sections": [
                    {
                        "section_id": "source-id-basic-form",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "source-id-name",
                                "name": "source-id-name",
                                "label": context.getMessage('name'),
                                "value": "{{name}}",
                                "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_]{0,62}$",
                                "placeholder": context.getMessage('source_identity_name_help'),
                                "error": context.getMessage('fw_rule_source_id_name_error'),
                                "required": true
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "source-id-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "source-id-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };
    return Configuration;
});
