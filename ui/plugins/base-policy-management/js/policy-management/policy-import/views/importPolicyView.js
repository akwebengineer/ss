/**
 * View to upload policy ZIP file
 * 
 * @module Upload Policy View
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    '../../../../../ui-common/js/common/widgets/progressBarForm.js',
    '../conf/importPolicyFormConfiguration.js'
], function (Backbone, FormWidget, OverlayWidget, progressBarForm, FormConfiguration) {

    var UploadPolicyView = Backbone.View.extend({
        events: {
            'click #policy-zip-import-save': "submit",
            'click #policy-zip-import-cancel': "cancel"
        },

        submit: function(event) {
            event.preventDefault();

            var self = this;
            var input = this.$el.find("#policy-import-form").find(".fileupload")[0];
            var formData = new FormData();

            // Check is form valid
            if (! this.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }

            formData.append("file", input.files[0]);
            //this.fileName = input.files[0].name;
            this.showProgressBar();
            // Upload selected ZIP file
            $.ajax({
                url: self.UPLOAD_URL,
                headers: {
                    Accept: self.UPLOAD_ACCEPT
                },
                type: "POST",
                data: formData,
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                success: function(data, textStatus) {
                    self.fileName = data["files-upload-response"]["fileName"];
                    self.onImportZipIntent();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Failed to upload file.");
                    self.form.showFormError(self.context.getMessage('import_zip_file_error'));
                }
            }).done(function(data) {
                  
            });
        },

        onImportZipIntent : function() {
             var self = this;
             var intent = new Slipstream.SDK.Intent("sd.intent.action.ACTION_IMPORT_ZIP",
              {
                mime_type: "vnd.juniper.net.import_zip"
              }
             );
             intent.putExtras(
              {
                "data":{
                  "service":self.serviceTYPE,
                  "fileName": self.fileName
                }
              });
            self.progressBarOverlay.destroy();
            this.context.startActivity(intent);
            self.activity.overlay.destroy();

        },
   
        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        validateFileName: function(id) {
            var comp = this.$el.find('#'+id);
            var input = this.$el.find("#policy-import-form").find(".fileupload")[0];
            var fileNameError = this.context.getMessage('import_zip_file_error');

            if (comp.attr("data-invalid") === undefined) {
                // Validate if the selected file is a Zip file.
                if (!this.isValidZipFile(input)) {
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
            this.context = options.activity.context;
            this.params = this.options.params;
            this.policyManagementConstants=this.params.policyManagementConstants;
            this.serviceTYPE = this.policyManagementConstants.SERVICE_TYPE,
            this.UPLOAD_URL = '/api/juniper/sd/policy-management/'+this.serviceTYPE+'/policy-upload-file',
            this.UPLOAD_ACCEPT = 'application/vnd.juniper.sd.policy-management.policy-upload-file-response+json;version=1;q=0.01';
            this.IMPORT_ACCEPT = 'application/vnd.juniper.sd.policy-management.policy-import-file-response+json;version=1;q=0.01';

        },

        isValidZipFile: function(input) {
            if (!input || !input.files[0] || !input.files[0].name) {
                return false;
            }

            if (input.files[0].name.indexOf('.') > 0) {
                var extension = input.files[0].name.substring(input.files[0].name.indexOf('.') + 1);
                if (extension.toLowerCase() !== 'zip') {
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
            this.$el.find('#policy-zip-import-area').bind('validateFileName', $.proxy(this.validateFileName, this, "policy-zip-import-area"));
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
                statusText: this.context.getMessage("import_zip_file_progress_bar_text"),
                title: this.context.getMessage("import_zip_file_progress_bar_overlay_title")
            });

            this.progressBarOverlay = new OverlayWidget({
                view: this.progressBar,
                type: 'small',
                showScrollbar: false
            });
            this.progressBarOverlay.build();

        },

        notify: function(type, message) {
          new Slipstream.SDK.Notification()
          .setText(message)
          .setType(type)
          .notify();
        },

    });

    return UploadPolicyView;
});