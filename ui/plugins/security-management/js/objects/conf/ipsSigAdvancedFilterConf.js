/*
 * 
 * @author avyaw <avyaw@juniper.net>
 */
define([], function() {
    var BasicFormConf = function(context) {
        this.getValues = function() {

            return {
                "title":  context.getMessage("advanced_search_filter"),
                "form_id": "advanced_search_filter",
                "form_name": "advanced_search_filter",
                "title-help": {
                    "content": context.getMessage("advanced_search_filter")
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                "err_div_link_text": "Create VPN Profile help",
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "sections": [
                    {
                        "heading": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_direction"),
                        "elements": [
                            {
                                "element_description": true,
                                "id": "direction-any",
                                "name": "direction-any",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_direction_any")
                            }, {
                                "element_description": true,
                                "id": "direction-cts",
                                "name": "direction-cts",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_direction_cts")
                            }, {

                                "element_description": true,
                                "id": "direction-stc",
                                "name": "direction-stc",
                                "label": context.getMessage("ips_sig_dynamic_form_tab_basic_field_label_direction_stc")
                            }
                        ]
                    },
                    {
                        "elements": [
                                       {
                                        "element_description": true,
                                        "value": '<select class="service-container" style="width:100%"></select>',
                                        "class":"service-container-id",
                                        "id": "service-container-id",
                                        "label": context.getMessage('ips_sig_dynamic_form_tab_advance_section_heading_service'),
                                        "name": "service-container-name"
                                    },
                                    {
                                        "element_description": true,
                                        "value": '<select class="platform-container" style="width:100%"></select>',
                                        "class":"platform-container-id",
                                        "id": "platform-container-id",
                                        "label": context.getMessage('devices_grid_column_platform'),
                                        "name": "platform-container-name"
                                    },
                                    {
                                        "element_description": true,
                                        "value": '<select class="action-container" style="width:100%"></select>',
                                        "class":"action-container-id",
                                        "id": "action-container-id",
                                        "label": context.getMessage('ips_action'),
                                        "name": "action-container-name"
                                    },
                                    {
                                        "element_description": true,
                                        "value": '<select class="math-ass-container" style="width:100%"></select>',
                                        "class":"math-ass-container-id",
                                        "id": "math-ass-container-id",
                                        "label": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_match_assurance"),
                                        "name": "math-ass-container-name"
                                    },
                                    {
                                        "element_description": true,
                                        "value": '<select class="perf-impact-container" style="width:100%"></select>',
                                        "class":"perf-impact-container-id",
                                        "id": "perf-impact-container-id",
                                        "label": context.getMessage("ips_sig_dynamic_form_tab_basic_section_heading_performance_impact"),
                                        "name": "perf-impact-container-name"
                                    },
                                    {
                                        "element_description": true,
                                        "value": '<select class="version-change-container" style="width:100%"></select>',
                                        "class":"version-change-container-id",
                                        "id": "version-change-container-id",
                                        "label": context.getMessage('advanced_search_version_changes'),
                                        "name": "version-change-container-name"
                                    },
                                    {
                                        "element_multiple_error": true,
                                        "id": "vendor",
                                        "name": "vendor",
                                        "label": context.getMessage('ips_sig_dynamic_form_tab_basic_section_heading_vendor'),
                                        "value": ""
                                    }
                 
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttonsClass":"buttons_row",
                "cancel_link": {
                    "id": "ipsSig-advanced-search-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "ipsSig-advance-search-submit",
                        "name": "create",
                        "value": "OK"
                    }
                ]
            };

        };
    };

    return BasicFormConf;

});