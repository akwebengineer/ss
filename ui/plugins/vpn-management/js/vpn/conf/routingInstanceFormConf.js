/**
 * A form configuration object with the common parameters required to build routing instance editor for
 * enpoint settings vpn wizard.
 *
 * @module routingInstanceFormConfiguration
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var routingInstanceFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_routing_instance"),
                "form_id": "edit_routinginstance_form",
                "form_name": "edit_routinginstance_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_routing_instance_tooltip"),
                    "ua-help-identifier": "alias_for_title_edit_profile_binding"
                },
                "err_div_id": "errorDiv",
                "err_div_message": "form_error",
                "err_div_link_text": "none",
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "cellEditor",
                        "section_class": "section_class",
                        "elements": [
                            {
                                "element_dropdown": true,
                                "id": "routingInstance-id",
                                "name": "routingInstance",
                                "label": context.getMessage("ipsec_vpns_routing_instance"),
                                "required": false,
                                "values": [
                                {
                                  "label": "",
                                  "value": ""
                                     }
                                ],
                                "error": "Please make a selection",
                                "field-help": {
                                    "content": context.getMessage("ipsec_vpns_routing_instance_field_tooltip"),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                }

                             },


                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnOk",
                        "name": "btnOk",
                        "value": context.getMessage("ok")
                    }
                ],
                "cancel_link": {
                    "id": "linkCancel",
                    "value": context.getMessage("cancel")
                }
            }
        };
    };

    return routingInstanceFormConfiguration;

});
