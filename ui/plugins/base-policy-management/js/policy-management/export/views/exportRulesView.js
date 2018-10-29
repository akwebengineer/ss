/**
 * Launches Export view Dialog.
 * In case filter is set, a confirmation dialog is created to check with user if to export all rules or export filtered rules
 *
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
        'backbone',
        'backbone.syphon',
        'widgets/confirmationDialog/confirmationDialogWidget',
        'widgets/overlay/overlayWidget',
        './exportRulesFormView.js'
    ],
    function (Backbone, Syphon, ConfirmationDialog, OverlayWidget, ExportRulesFormView) {

        var exportRulesView = Backbone.View.extend({


            initialize: function (options) {
                var self = this;

                self.params = self.options.params;
                self.context = self.options.context;

                if (self.params.filter) {
                    self.createConfirmationDialog();
                } else {
                    self.startExport();
                }


            },

            startExport: function (exportFiltered) {
                var self = this, view, overlay, filter;

                if (exportFiltered) {
                    filter = self.params.filter.FilterParam
                }

                view = new ExportRulesFormView({
                    context: self.context,
                    params: {
                        selectedPolicies: self.params.selectedPolicy,
                        fileType: self.params.fileType,
                        filter: filter,
                        policyManagementConstants: self.params.policyManagementConstants
                    },
                    /**
                     * Close the overlay if it exists
                     * @param e
                     */
                    'close': function (e) {
                        if (overlay) {
                            overlay.destroy();
                        }
                        e && e.preventDefault();
                    }
                });

                self.exportView = view;
                
                // Show initialize screen when launched from filtered view, else launch the export action directly.
                if(self.confirmationDialogWidget) {
                    self.confirmationDialogWidget.destroy();
                    view.exportPolicy();
                } else {
                    overlay = new OverlayWidget({
                        view: view,
                        type: 'xsmall',
                        height: '680px'
                    });
                  overlay.build();
                }
            },


            /**
             * Create a confirmation dialog with basic settings
             * Need to specify title, question, and event handle functions in "option"
             */
            createConfirmationDialog: function (option) {

                var self = this;
                self.confirmationDialogWidget = new ConfirmationDialog({
                    title: self.context.getMessage('rules-export-title'),
                    question: self.context.getMessage('rules-export-question'),
                    yesButtonLabel: self.context.getMessage('export-filtered-rules'),
                    noButtonLabel: self.context.getMessage('export-all-rules'),
                    cancelLinkLabel: self.context.getMessage('cancel'),
                    yesButtonTrigger: 'exportFiltered',
                    noButtonTrigger: 'exportAll',
                    cancelLinkTrigger: 'cancelEventTriggered',
                    xIcon: true
                });

                self.bindDialogEvents();
                self.confirmationDialogWidget.build();
            },

            bindDialogEvents: function () {
                var self = this;
                this.confirmationDialogWidget.vent.on('exportFiltered', function () {
                    self.startExport(true);
                });

                this.confirmationDialogWidget.vent.on('exportAll', function () {
                    self.startExport();
                });

                this.confirmationDialogWidget.vent.on('cancelEventTriggered', function () {
                    self.confirmationDialogWidget.destroy();
                });
            }
        });
        return exportRulesView;
    });
