/**
 * Form configuration required to render the content type form using the FormWidget.
 *
 * @module Content Type Form Configuration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                   "form_id": "utm-contentfiltering-content-type-form",
                   "form_name": "utm-contentfiltering-content-type-form",
                    "sections": [
                       {
                           //"heading_text": context.getMessage('utm_content_filtering_content_types_text'),
                           "elements": [
                                {
                                   "element_checkbox": true,
                                   "id": "block-content-type-list",
                                   "field-help": {
                                       "content": context.getMessage('utm_content_filtering_block_content_type_tooltip')
                                   },
                                   "label": context.getMessage('utm_content_filtering_block_content_type'),
                                   "values": [
                                       {
                                           "id": "block-content-type-activex",
                                           "name": "block-content-type-activex",
                                           "label": context.getMessage('utm_content_filtering_block_content_type_activex'),
                                           "value": "ACTIVEX"
                                       },
                                       {
                                           "id": "block-content-type-exe",
                                           "name": "block-content-type-exe",
                                           "label": context.getMessage('utm_content_filtering_block_content_type_exe'),
                                           "value": "EXE"
                                       },
                                       {
                                           "id": "block-content-type-http-cookie",
                                           "name": "block-content-type-http-cookie",
                                           "label": context.getMessage('utm_content_filtering_block_content_type_http_cookie'),
                                           "value": "HTTP_COOKIE"
                                       },
                                       {
                                           "id": "block-content-type-java-applet",
                                           "name": "block-content-type-java-applet",
                                           "label": context.getMessage('utm_content_filtering_block_content_type_java_applet'),
                                           "value": "JAVA_APPLET"
                                       },
                                       {
                                           "id": "block-content-type-zip",
                                           "name": "block-content-type-zip",
                                           "label": context.getMessage('utm_content_filtering_block_content_type_zip'),
                                           "value": "ZIP"
                                       }
                                   ]
                               }
                           ]
                       }
                    ]
                };
            };
        };

        return Configuration;
});