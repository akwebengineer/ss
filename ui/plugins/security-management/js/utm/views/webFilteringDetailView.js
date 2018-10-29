/**
 * Detail View of a Web-Filtering profile
 *
 * @module webFilteringDetailView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'widgets/grid/gridWidget',
    '../../../../ui-common/js/views/detailView.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (Backbone, GridWidget, DetailView, GridConfigurationConstants) {

    var getEngineTypeValue = function(value, context) {
        switch (value) {
            case "JUNIPER_ENHANCED":
                return context.getMessage("utm_web_filtering_engine_type_juniper_enhanced");
                break;
            case "SURF_CONTROL":
                return context.getMessage("utm_web_filtering_engine_type_surf_control");
                break;
            case "WEBSENSE":
                return context.getMessage("utm_web_filtering_engine_type_websense_redirect");
                break;
            default:
                return context.getMessage("utm_web_filtering_engine_type_local");
        }
    };

    var getActionValue = function (value, context) {
        switch (value) {
            case "PERMIT":
                return context.getMessage("utm_web_filtering_default_action_permit");
                break;
            case "BLOCK":
                return context.getMessage("utm_web_filtering_default_action_block");
                break;
            case "QUARANTINE":
                return context.getMessage("utm_web_filtering_default_action_quarantine");
                break;
            case "LOG_AND_PERMIT":
                return context.getMessage("utm_web_filtering_default_action_log_and_permit");
                break;
            default:
                return "";
        }
    };

    var WebFilteringDetailView = DetailView.extend({

        getFormConfig: function() {
            var sections = [],
                values = this.model.attributes;
            console.log(values);
            // General info
            var eleArr = [];
            eleArr.push({
                'label': this.context.getMessage('name'),
                'value': values.name
            });
            eleArr.push({
                'label': this.context.getMessage('description'),
                'value': values.description
            });
            eleArr.push({
                'label': this.context.getMessage('utm_web_filtering_engine_type'),
                'value': getEngineTypeValue(values["profile-type"], this.context)
            });
            if (values["default-action"]) {
                eleArr.push({
                    'label': this.context.getMessage('utm_web_filtering_default_action'),
                    'value': getActionValue(values['default-action'], this.context)
                });
            }
            if (values["account"]) {
                eleArr.push({
                    'label': this.context.getMessage('utm_web_filtering_account'),
                    'value': values["account"]
                });
            }
            if (values["server"]) {
                eleArr.push({
                    'label': this.context.getMessage('utm_web_filtering_server'),
                    'value': values["server"]
                });
            }
            if (values["port"]) {
                eleArr.push({
                    'label': this.context.getMessage('utm_web_filtering_port'),
                    'value': values["port"]
                });
            }
            if (values["sockets"]) {
                eleArr.push({
                    'label': this.context.getMessage('utm_web_filtering_sockets'),
                    'value': values["sockets"]
                });
            }
            if (values["timeout"]) {
                eleArr.push({
                    'label': this.context.getMessage('utm_web_filtering_timeout'),
                    'value': values["timeout"]
                });
            }
            if (values["custom-block-message"]) {
                eleArr.push({
                    'label': this.context.getMessage('utm_web_filtering_custom_block_message'),
                    'value': values["custom-block-message"]
                });
            }
            if (values["custom-quarantine-message"]) {
                eleArr.push({
                    'label': this.context.getMessage('utm_web_filtering_custom_quarantine_message'),
                    'value': values["custom-quarantine-message"]
                });
            }
            sections.push({
                "heading_text": this.context.getMessage("utm_web_filtering_title_general_information"),
                elements: eleArr
            })
            //Fallback options
            if (values["fallback-default-action"]) {
                var eleArr = [];
                eleArr.push({
                    'label': this.context.getMessage('utm_web_filtering_default_action'),
                    'value': getActionValue(values['fallback-default-action'], this.context)
                });
                sections.push({
                    "heading_text": this.context.getMessage("utm_web_filtering_fallback_option_section_title"),
                    elements: eleArr
                });
            }
            // Reputation actions
            if (values["site-reputation-actions"]) {
                var eleArr = [];
                eleArr.push({
                    'label': this.context.getMessage('utm_web_filtering_global_reputation_action_very_safe'),
                    'value': getActionValue(values["site-reputation-actions"]["very-safe"], this.context)
                });
                eleArr.push({
                    'label': this.context.getMessage('utm_web_filtering_global_reputation_action_moderately_safe'),
                    'value': getActionValue(values["site-reputation-actions"]["moderately-safe"], this.context)
                });
                eleArr.push({
                    'label': this.context.getMessage('utm_web_filtering_global_reputation_action_fairly_safe'),
                    'value': getActionValue(values["site-reputation-actions"]["fairly-safe"], this.context)
                });
                eleArr.push({
                    'label': this.context.getMessage('utm_web_filtering_global_reputation_action_suspicious'),
                    'value': getActionValue(values["site-reputation-actions"]["suspicious"], this.context)
                });
                eleArr.push({
                    'label': this.context.getMessage('utm_web_filtering_global_reputation_action_harmful'),
                    'value': getActionValue(values["site-reputation-actions"]["harmful"], this.context)
                });
                sections.push({
                    "heading_text": this.context.getMessage("utm_web_filtering_global_reputation_action_section_title"),
                    elements: eleArr
                });
            }
            // URL Categories
            if (values["url-category-action-list"]) {
                sections.push({
                    elements: [{
                        "id" : "urlCategoryListContainer",
                        "label": this.context.getMessage("utm_web_filtering_title_url_category_information")
                    }]
                });
            }
            var config = {
                sections: sections
            };
            return config;
        },

        initialize: function(options) {
            DetailView.prototype.initialize.call(this, options);

            this.fetchErrorKey = 'utm_web_filtering_fetch_error';
            this.objectTypeText = this.context.getMessage('utm_web_filtering_grid_title');
        },

        render: function() {
            // Get form configuration
            var conf = this.getFormConfig();
            // Render form
            this.$el.addClass("security-management");
            this.renderForm(conf);
            var gridContainer = this.$el.find("#urlCategoryListContainer");
            if (gridContainer.length > 0) {
                gridContainer = gridContainer.parent();
                gridContainer.removeClass();
                gridContainer.addClass("element-left-align");
                var gridWidget = new GridWidget({
                    container: gridContainer,
                    elements: this.getURLCategoriesGrid()
                });
                var data = this.model.attributes["url-category-action-list"]["url-category-action"];
                $.when(gridWidget.build()).done(function() {
                    if (!$.isEmptyObject(data)) {
                        data.forEach(function(item) {
                            gridWidget.addRow({
                                "urlcategory": item["url-category-list"]["name"],
                                "domain": item["url-category-list"]["domain-name"],
                                "action": item["action"]
                            }, "last");
                        });
                    }
                });
            }
            return this;
        },

        getURLCategoriesGrid: function () {
            return {
                "tableId": "webfiltering-urlcategories-list",
                "numberOfRows": GridConfigurationConstants.OVERLAY_PAGE_SIZE,
                "height": "200px",
                "repeatItems": "true",
                "scroll": true,
                "jsonId": "urlcategory",
                "sorting": [ 
                    {
                        "column": "urlcategory",
                        "order": "asc"
                    }
                ],
                "columns": [
                    {
                        "index": "urlcategory",
                        "name": "urlcategory",
                        "label": this.context.getMessage('url_category_type_text'),
                        "width": 210
                    },
                    {
                        "index": "domain",
                        "name": "domain",
                        "label": this.context.getMessage('grid_column_domain'),
                        "width": 150
                    },
                    {
                        "index": "action",
                        "name": "action",
                        "label": this.context.getMessage('utm_antispam_grid_column_action'),
                        "width": 160
                    }
                ]
            };
        }
    });

    return WebFilteringDetailView;
});