/*
 *ipsSigDynAdvanceFormConfiguration.js
 * @author dkumara <dkumara@juniper.net>
 *
 */
define([], function() {
    var AdvanceFormConf = function(context) {

        this.getValues = function() {

            return {
                "form_id": "advance-configuration",
                "form_name": "advance-configuration",
                "title-help": {
                    "content": context.getMessage("ips_sig_dynamic_form_tab_advance_title_help"),
                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                },
                "sections": [{
                        "elements": [{
                                "element_text": true,
                                "id": "ips-sig-dyn-category-set",
                                "name": "Category",
                                "label": "Category",
                                "placeholder": context.getMessage('loading'),
                                "error": context.getMessage('ips_sig_select_category_error'),
                                "field-help": {
                                    "content": context.getMessage('ips_dynamic_category_tooltip'),
                                    "ua-help-identifier": "alias_for_ips_sig_select_category_ua_event_binding"
                                },
                                "class": "list-builder"
                            }
                        ]
                    }, 
                    {
                        "elements": [
                            {
                                "element_text": true,
                                "id": "ips-sig-dyn-service-set",
                                "name": "Service",
                                "label": "Service",
                                "placeholder": context.getMessage('loading'),
                                "error": context.getMessage('ips_sig_select_service_error'),
                                "field-help": {
                                    "content": context.getMessage('ips_dynamic_service_tooltip'),
                                    "ua-help-identifier": "alias_for_ips_sig_select_category_ua_event_binding"
                                },
                                "class": "list-builder"
                            }
                        ]
                    },
                    {
                        "heading": context.getMessage("ips_sig_dynamic_form_tab_advance_section_heading_severity"),
                        "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                        "elements": [
                                                            {
                                "element_description": true,
                                "value": '<select class="severity-container" style="width:100%"></select>',
                                "class":"severity-container-id",
                                "id": "severity-container-id",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_advance_section_heading_severity"),
                                "name": "severity-container-name"
                            }
                 
                        ]
                    }
                ]
            };
        };
    };

    return AdvanceFormConf;
});