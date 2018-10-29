/**
 * Form configuration required to render the protocol command form using the FormWidget.
 *
 * @module Protocol Command Form Configuration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                   "form_id": "utm-contentfiltering-protocol-command-form",
                   "form_name": "utm-contentfiltering-protocol-command-form",
                    "sections": [
                       {
                            //"heading_text": context.getMessage('utm_content_filtering_protocol_commands_text'),
                            "elements": [{
                                     "element_textarea": true,
                                     "id": "block-command-list",
                                     "name": "block-command-list",
                                     "label": context.getMessage('utm_content_filtering_block_command_list'),
                                     "required": false,
                                     "field-help": {
                                         "content": context.getMessage('utm_content_filtering_block_command_tooltip')
                                     },
                                     "post_validation": "commandListValidator",
                                     "placeholder": context.getMessage('utm_content_filtering_protocol_commands_placeholder'),
                                     "help": context.getMessage('utm_content_filtering_block_command_list_help')
                                 },
                                 {
                                     "element_textarea": true,
                                     "id": "permit-command-list",
                                     "name": "permit-command-list",
                                     "label": context.getMessage('utm_content_filtering_permit_command_list'),
                                     "required": false,
                                     "field-help": {
                                         "content": context.getMessage('utm_content_filtering_permit_command_tooltip')
                                     },
                                     "post_validation": "commandListValidator",
                                     "placeholder": context.getMessage('utm_content_filtering_protocol_commands_placeholder'),
                                     "help": context.getMessage('utm_content_filtering_permit_command_list_help')
                                 }
                            ]
                       }
                    ]
                };
            };
        };

        return Configuration;
});