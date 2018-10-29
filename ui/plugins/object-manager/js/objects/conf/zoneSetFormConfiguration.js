/**
 * A configuration object with the parameters required to build 
 * a form for Zone-sets
 *
 * @module zoneSetFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {
        var DESCRIPTION_MAX_LENGTH = 255;

        this.getValues = function() {

            return {
                "form_id": "zone-set-form",
                "form_name": "zone-set-form",
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage('zone_set_create_intro'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier":context.getHelpKey("SHARED_OBJECTS_ZONE_SET_CREATING")
                },
                "add_remote_name_validation": 'zone-set-name',
                "sections": [
                    {
                        "elements": [
                            {
                                "element_multiple_error": true,
                                "id": "zone-set-name",
                                "name": "name",
                                "value": "{{name}}",
                                "label": context.getMessage('name'),
                                "placeholder": context.getMessage('zone_set_name_placeholder'),
                                "field-help": {
                                    "content": context.getMessage('zone_set_name_tooltip')
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
                                        "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_.:\/]{0,62}$",
                                        "error": context.getMessage('zone_set_name_error')
                                    }
                                ]
                            },
                            {
                                "element_textarea": true,
                                "id": "zone-set-description",
                                "name": "description",
                                "value": "{{description}}",
                                "label": context.getMessage('description'),
                                "placeholder": context.getMessage('zone_set_description_placeholder'),
                                "max_length": DESCRIPTION_MAX_LENGTH,
                                "post_validation": "descriptionValidator",
                                "field-help": {
                                    "content": context.getMessage('zone_set_description_tooltip')
                                }
                            },
                            {
                                "element_text": true,
                                "id": "zone-set-zones",
                                "name": "zones",
                                "label": context.getMessage('zone_set_zones'),
                                "placeholder": context.getMessage('loading'),
                                "error": context.getMessage('zone_set_zones_error'),
                                "required": true,
                                "field-help": {
                                    "content": context.getMessage('zone_set_zones_tooltip'),
                                    "ua-help-identifier": "alias_for_zones_ua_event_binding"
                                },
                                "class": "list-builder listBuilderPlaceHolder"
                            },
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "zone-set-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "zone-set-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});
