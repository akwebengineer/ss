/**
 * Form configuration required to render the MIME types form using the FormWidget.
 *
 * @module MIME Form Configuration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                   "form_id": "utm-contentfiltering-mime-form",
                   "form_name": "utm-contentfiltering-mime-form",
                    "sections": [
                       {
                            //"heading_text": context.getMessage('utm_content_filtering_mime_types_text'),
                            "elements": [{
                                     "element_textarea": true,
                                     "id": "block-mime-list",
                                     "name": "block-mime-list",
                                     "label": context.getMessage('utm_content_filtering_block_mime_list'),
                                     "required": false,
                                     "field-help": {
                                         "content": context.getMessage('utm_content_filtering_mime_block_list_tooltip')
                                     },
                                     "post_validation": "mimeListValidator",
                                     "placeholder": context.getMessage('utm_content_filtering_mime_types_placeholder'),
                                     "help": context.getMessage('utm_content_filtering_block_mime_list_help')
                                 },
                                 {
                                     "element_textarea": true,
                                     "id": "block-mime-exception-list",
                                     "name": "block-mime-exception-list",
                                     "label": context.getMessage('utm_content_filtering_block_mime_exception_list'),
                                     "required": false,
                                     "field-help": {
                                         "content": context.getMessage('utm_content_filtering_mime_permit_list_tooltip')
                                     },
                                     "post_validation": "mimeListValidator",
                                     "placeholder": context.getMessage('utm_content_filtering_mime_types_placeholder'),
                                     "help": context.getMessage('utm_content_filtering_block_mime_exception_list_help')
                                 }
                            ]
                       }
                    ]
                };
            };
        };

        return Configuration;
});