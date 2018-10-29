/**
 * View to import variable CSV file
 * 
 * @module VariableImportView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    'widgets/confirmationDialog/confirmationDialogWidget',
    '../../../../ui-common/js/common/widgets/progressBarForm.js',
    '../conf/variableImportFormConfiguration.js',
    '../models/variableImportModel.js',
    'text!../../../../sd-common/js/templates/csvSampleLink.html',
    '../../../../sd-common/js/common/widgets/jobInformationForm.js'
], function (Backbone, FormWidget, OverlayWidget, ConfirmationDialog, progressBarForm, FormConfiguration, ImportModel, SampleLinkTemplate, JobInformationForm) {
    var UPLOAD_URL = '/api/juniper/sd/file-management/upload-files?file-type=CSV';
    var UPLOAD_ACCEPT = 'application/vnd.juniper.sd.upload-files-response+json;version=1;q=0.01';
    var CSV_SAMPLE_URL = '../installed_plugins/sd-common/js/common/csv/VariableImportSample.csv';
    var importModel = new ImportModel();

    var VariableImportView = Backbone.View.extend({
        events: {
            'click #variable-import-save': "submit",
            'click #variable-import-cancel': "cancel"
        },

        submit: function(event) {
            event.preventDefault();

            var self = this;
            var input = this.$el.find("#variable-import-form").find(".fileupload")[0];
            var formData = new FormData();

            // Check is form valid
            if (! this.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }

            formData.append("file", input.files[0]);
            this.showProgressBar();
            // Upload selected CSV file
            $.ajax({
                url: UPLOAD_URL,
                headers: {
                    Accept: UPLOAD_ACCEPT
                },
                type: "POST",
                data: formData,
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                success: function(data, textStatus) {
                    self.progressBarOverlay.destroy();
                    // Import the uploaded CSV file
                    self.importCsv(input.files[0].name);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Failed to upload file.");
                    self.form.showFormError(self.context.getMessage('import_csv_file_upload_error'));
                    self.progressBarOverlay.destroy();
                }
            }).done(function(data) {
                  self.activity.finish();
                  self.activity.overlay.destroy();
            });
        },

        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        importCsv: function(fileName) {
            var self = this;

            importModel.clear();
            // set request body
            importModel.set({
                "import-file":{
                    "file-name": fileName
                }
            });

            importModel.save(null, {
                success: function(model, response) {
                    self.showJobInformation(response.task);
                },
                error: function(model, response) {
                    console.log("error");
                }
            });
        },

        validateFileName: function(id) {
            // Work around it until the framework adds direct support for supplying a validation callback function
            // So that we don't need to show error manually
            var comp = this.$el.find('#'+id);
            var input = this.$el.find("#variable-import-form").find(".fileupload")[0];
            var fileNameError = this.context.getMessage('import_csv_file_error');

            if (comp.attr("data-invalid") === undefined) {
                // Validate if the selected file is a CSV file.
                if (!this.isValidCsvFile(input)) {
                    this.showFileNameErrorMessage(id, fileNameError);
                }
            } else {
                this.showFileNameErrorMessage(id, fileNameError);
            }
        },
        showFileNameErrorMessage: function(id, message) {
            this.$el.find('#'+id).attr("data-invalid", "").parent().parent().addClass('error');
            this.$el.find('label[for='+id+']').parent().addClass('error');
            this.$el.find('#'+id).parent().parent().find("small[class*='error']").html(message);
        },

        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
        },

        isValidCsvFile: function(input) {
            if (!input || !input.files[0] || !input.files[0].name) {
                return false;
            }

            if (input.files[0].name.indexOf('.') > 0) {
                var extension = input.files[0].name.substring(input.files[0].name.indexOf('.') + 1);
                if (extension.toLowerCase() !== 'csv') {
                    return false;
                }
            } else {
                return false;
            }

            return true;
        },

        render: function() {
            var self = this;
            var formConfiguration = new FormConfiguration(this.context);

            this.form = new FormWidget({
                container: this.el,
                elements: formConfiguration.getValues()
            });
            this.form.build();

            // CSV sample link
            var templateData = {
                id: 'variable-import-sample',
                url: CSV_SAMPLE_URL,
                content: this.context.getMessage("import_sample")
            };
            this.$el.find('#variable-import-sample').html(Slipstream.SDK.Renderer.render(SampleLinkTemplate, templateData));
            // Add post_validation to validate selected file name
            this.$el.find('#variable-import-area').bind('validateFileName', $.proxy(this.validateFileName, this, "variable-import-area"));
            // Validate the input once a file is selected
            this.$el.find('.fileupload').on('change', function () {
                if (! self.form.isValidInput()) {
                    console.log('form is invalid');
                    return;
                }
            });

            return this;
        },

        showProgressBar: function() {
            this.progressBar = new progressBarForm({
                statusText: this.context.getMessage("import_csv_file_progress_bar_text"),
                title: this.context.getMessage("import_csv_file_progress_bar_overlay_title")
            });

            this.progressBarOverlay = new OverlayWidget({
                view: this.progressBar,
                type: 'small',
                showScrollbar: false
            });
            this.progressBarOverlay.build();
        },

        showOverlay: function(view, size) {
            this.overlay = new OverlayWidget({
                view: view,
                type: size || 'medium',
                showScrollbar: true
            });
            this.overlay.build();
        },

        showJobInformation: function(task){
            var self = this;
            var jobInformation = new JobInformationForm({
                    context: this.context,
                    jobId: task.id,
                    okButtonCallback: function() {
                        self.activity.overlay.destroy();
                    }
                });

            self.showOverlay(jobInformation, 'small');
        },

        createConfirmationDialog: function(option) {
            var self = this;

            this.confirmationDialogWidget = new ConfirmationDialog({
                title: option.title,
                question: option.question,
                yesButtonLabel: self.context.getMessage('ok'),
                yesButtonCallback: function() {
                    self.confirmationDialogWidget.destroy();
                },
                yesButtonTrigger: 'yesEventTriggered',
                xIcon: false
            });

            this.bindConfirmationDialogEvents(option);
            this.confirmationDialogWidget.build();
        },

        bindConfirmationDialogEvents: function(option) {
            this.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
                if (option.yesEvent) {
                    option.yesEvent();
                }
            });
        }
    });

    return VariableImportView;
});