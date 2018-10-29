/**
 * Launches Rules Export View
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
        'backbone',
        './exportPolicyFormView.js',
        '../conf/exportRulesViewConf.js'
    ],
    function (Backbone, ExportPolicyFormView, ExportRulesViewConf) {

        var exportRulesFormView = ExportPolicyFormView.extend({

            events: {
                "click #cancelExportRules": "closeExportView",
                "click #exportRules": "exportPolicy"
            },

            initialize: function (options) {
                var self = this;
                self.options = options;
                self.params = self.options.params;
                self.context = self.options.context;
                self.policyManagementConstants = self.params.policyManagementConstants;
            },


            /**
             * Returns form element
             * @returns {*}
             */
            getFormElements: function () {
                var me = this;
                var formConfiguration = new ExportRulesViewConf(this.context);
                return formConfiguration.getExportRulesFormElements();
            },

            /**
             * Add dynamic text configurations based on file type
             * @param formConfiguration
             */
            addDynamicFormConfig: function (formConfiguration) {
                var dynamicProperties = {};
                switch (this.params.fileType) {
                    case "HTML_FORMAT":
                        dynamicProperties.title = this.context.getMessage('export_rules_to_html');
                        dynamicProperties.tooltip = this.context.getMessage('export_rules_to_html');
                        break;

                    case "PDF_FORMAT":
                        dynamicProperties.title = this.context.getMessage('export_rules_to_pdf');
                        dynamicProperties.tooltip = this.context.getMessage('export_rules_to_pdf');
                        break;

                    case "ZIP_FORMAT":
                        dynamicProperties["title-help"] = { "content": this.context.getMessage('rules_export_zip_tooltip'),
                            "ua-help-text": this.context.getMessage("more_link"),
                            "ua-help-identifier": this.context.getHelpKey("POLICY_EXPORTING")
                        };
                        dynamicProperties.title = this.context.getMessage('export_rules_zip_title');
                        dynamicProperties.tooltip = this.context.getMessage('export_rules_to_zip');
                        break;
                }
                _.extend(formConfiguration, dynamicProperties);
            },

            /**
             * With the data posted, add the filter params
             * @param idArray
             * @returns {{export-policy-request: {policy-ids: {policy-id: *},
              *             export-format: (.params.fileType|*), FilterParam: *}}}
             */
            getPostData: function (idArray) {
                return  {
                    "export-policy-request": {
                        "policy-ids": {
                            "policy-id": idArray
                        },
                        "export-format": this.params.fileType,
                        "FilterParam": this.params.filter
                    }
                };
            },

            /*
            Sets job progress window text
             */
            getProgressText: function () {
                return  {
                    "title": this.context.getMessage("export_rules_job_window_title"),
                    "fileType": this.context.getMessage("export_rules_file")
                }
            },

            /**
             * Close the view
             * @param event
             */
            closeExportView: function (event) {
                if (event) {
                    event.preventDefault();
                }

                this.options.close();
            }



        });
        return exportRulesFormView;
    });
