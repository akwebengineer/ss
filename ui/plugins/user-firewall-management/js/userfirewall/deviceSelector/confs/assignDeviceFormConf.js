/**
 * Form configuration required to render the general form using the FormWidget.
 *
 * @module General Form Configuration for access profile General Settings
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    /**
     *
     * @param context
     * @constructor
     */
    var Configuration = function(context) {

        /**
         *
         * @returns {{form_id: string, form_name: string, sections: {elements: {element_description: boolean, class: string, id: string, name: string, label: *}[]}[]}}
         */
        this.getValues = function(options) {

            return {
                "form_id": "access_profile_device_selector_form",
                "form_name": "access_profile_device_selector_form",
                "sections": [{

                    "elements": [
                        {
                            "element_description": true,
                            "class": "list-builder listBuilderPlaceHolder",
                            "id": "user_firewall_device_selector",
                            "name": "user_firewall_device_selector",
                            "label": context.getMessage('device'),
                            "field-help": {
                                "content": context.getMessage(options.help)
                            }
                        }
                    ]
                },{
                    heading:'',
                    "elements": [
                        {
                        }]
                }]
            };
        };
    };

    return Configuration;
});