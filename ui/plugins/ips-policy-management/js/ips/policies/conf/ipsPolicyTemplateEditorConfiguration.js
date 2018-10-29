/**
 * 
 * @author Ashish <avyaw@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var ipsPolicyTemplateEditorConfiguration = function (context) {

        this.getConfig = function () {
            return {
                "title": context.getMessage('ips_policy_templates_grid_title'),
                "form_id": "cellEditorForm",
                "form_name": "cellEditorForm",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "cellEditor",
                        "elements": [
                            {
                                "element_text": true,
                                "id": "list-builder-element",
                                "name": "list-builder-element",
                                "label": context.getMessage('ips_policy_template_selection'),
                                "placeholder": context.getMessage('loading'),
                                "class": "list-builder listBuilderPlaceHolderHigh",
                                "field-help": {
                                    "content": context.getMessage('ips_policy_template_editor_description'),
                                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                                }
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "cancel",
                    "value": context.getMessage("cancel")
                }
            }
        };
    };

    return ipsPolicyTemplateEditorConfiguration;

});
