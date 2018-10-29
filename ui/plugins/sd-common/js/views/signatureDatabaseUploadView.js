/**
 * View to upload signature database from file system
 *
 * @module SignatureDatabaseUploadView
 * @author Slipstream Developers <spog_dev @juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    '../../../ui-common/js/common/widgets/progressBarForm.js',
    '../conf/signatureDatabaseUploadFormConf.js',
    '../models/signatureDatabaseUploadModel.js',
    '../common/widgets/jobInformationForm.js'
], function (Backbone, FormWidget, OverlayWidget, progressBarForm, FormConfiguration, SignatureDatabaseUploadModel, JobInformationForm) {
    var UPLOAD_URL = '/api/juniper/sd/file-management/upload-files?file-type=IPS_SIG_UPLOAD' ;
    var UPLOAD_ACCEPT = 'application/vnd.juniper.sd.upload-files-response+json;version=1;q=0.01' ;
    var uploadModel = new SignatureDatabaseUploadModel({});

    var SignatureDatabaseUploadView = Backbone.View.extend({
        events: {
            'click #signature-database-upload-upload': "submit",
            'click #signature-database-upload-cancel': "cancel",
            'change .fileupload': "onFileSelectChange"
        },

        onFileSelectChange: function(event) {
            if (! this.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }
        },

        submit: function(event) {
            event.preventDefault();

            var self = this ;
            var input = this.$el.find("#signature-database-upload-form").find(".fileupload")[0];
            var formData = new FormData();

            if (! this.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }

            formData.append( "file", input.files[0]);
            this.showProgressBar(input.files[0].name);
            // Upload selected attack file
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
                    // More actions for upload file
                    self.importFile(input.files[0].name);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log( "Failed to upload file.");
                    self.progressBarOverlay.destroy();
                    self.form.showFormError(errorThrown);
                }
            });
        },

        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        importFile: function(fileName) {
            var self = this ;

            uploadModel.clear();
            // set request body
            uploadModel.set({
                "import-file":{
                    "file-name": fileName
                }
            });

            uploadModel.save( null, {
                success: function(model, response) {
                    self.activity.overlay.destroy();
                    self.showJobInformation(response.task);
                },
                error: function(model, response) {
                    console.log("import file error");
                    self.form.showFormError(response.responseText);
                }
            });
        },

        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.context;
        },

        render: function() {
            var formConfiguration = new FormConfiguration(this.context);

            this.form = new FormWidget({
                container: this.el,
                elements: formConfiguration.getValues()
            });
            this.form.build();
            return this ;
        },

        showProgressBar: function(fileName) {
            this.progressBar = new progressBarForm({
                statusText: this.context.getMessage("signature_database_upload_progress_bar_text", [fileName]),
                title: this.context.getMessage("signature_database_upload_progress_bar_overlay_title")
            });

            this.progressBarOverlay = new OverlayWidget({
                view: this.progressBar,
                type: 'small',
                showScrollbar: false
            });
            this.progressBarOverlay.build();
        },

        showJobInformation: function(task){
            var self = this ;

            var jobInformation = new JobInformationForm({
                    context: this.context,
                    jobId: task.id,
                    okButtonCallback: function() {
                        self.activity.overlay.destroy();
                    }
                });

            this.activity.showOverlay(jobInformation, 'small');
        }
    });

    return SignatureDatabaseUploadView;
});
