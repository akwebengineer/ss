/**
 * Form configuration required to render the file extentsion form using the FormWidget.
 *
 * @module File Extentsion Form Configuration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                   "form_id": "utm-contentfiltering-file-extension-form",
                   "form_name": "utm-contentfiltering-file-extension-form",
                    "sections": [
                       {
                            //"heading_text": context.getMessage('utm_content_filtering_file_extensions_text'),
                            "elements": [{
                                     "element_textarea": true,
                                     "id": "block-file-extension-list",
                                     "name": "block-file-extension-list",
                                     "label": context.getMessage('utm_content_filtering_block_file_extension_list'),
                                     "required": false,
                                     "field-help": {
                                         "content": context.getMessage('utm_content_filtering_file_extension_tooltip')
                                     },
                                     "post_validation": "fileExtensionListValidator",
                                     "placeholder": context.getMessage('utm_content_filtering_file_extensions_placeholder'),
                                     "help": context.getMessage('utm_content_filtering_block_file_extension_list_help')
                                 }
                            ]
                       }
                    ]
                };
            };
        };

        return Configuration;
});