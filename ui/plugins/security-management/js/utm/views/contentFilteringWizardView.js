define([
  'backbone',
  'widgets/shortWizard/shortWizard',
  '../views/contentFilteringWelcomeView.js',
  '../views/contentFilteringGeneralFormView.js',
  '../views/contentFilteringProtocolCommandFormView.js',
  '../views/contentFilteringContentTypeFormView.js',
  '../views/contentFilteringFileExtensionFormView.js',
  '../views/contentFilteringMIMEFormView.js',
  '../../../../ui-common/js/views/apiResourceView.js'
  ], function(Backbone,
          ShortWizard,
          WelcomeView,
          GeneralFormView,
          ProtocolCommandFormView,
          ContentTypeFormView,
          FileExtensionFormView,
          MIMEFormView,
          ResourceView){
    var ContentFilteringWizardView = ResourceView.extend({

        initialize: function (options) {
            var self = this,
                pages = new Array();

            ResourceView.prototype.initialize.call(this, options);

            // Welcome view
            pages.push({
                title: "",
                view: new WelcomeView({
                    context: this.context
                }),
                intro: true
            });

            // General view
            pages.push({
                title: this.context.getMessage('utm_content_filtering_general'),
                view: new GeneralFormView({
                    context: this.context,
                    model: this.model,
                    wizardView: this
                })
            });

            // Protocol commands view
            pages.push({
                title: this.context.getMessage('utm_content_filtering_protocol_commands'),
                view: new ProtocolCommandFormView({
                    context: this.context,
                    model: this.model
                })
            });

            // Content types views
            pages.push({
                title: this.context.getMessage('utm_content_filtering_content_types'),
                view: new ContentTypeFormView({
                    context: this.context,
                    model: this.model
                })
            });

            // File extensions views
            pages.push({
                title: this.context.getMessage('utm_content_filtering_file_extensions'),
                view: new FileExtensionFormView({
                    context: this.context,
                    model: this.model
                })
            });

            // MIME types views
            pages.push({
                title: this.context.getMessage('utm_content_filtering_mime_types'),
                view: new MIMEFormView({
                    context: this.context,
                    model: this.model
                })
            });

            this.wizard = new ShortWizard({
                container: this.el,
                title: this.context.getMessage('utm_content_filtering_create'),
                summaryEncode: false,
                titleHelp: {
                    "content": this.context.getMessage("utm_content_filtering_create_view_tooltip"),
                    "ua-help-text": this.context.getMessage('more_link'),
                    "ua-help-identifier": this.context.getHelpKey("UTM_CONTENT_FILTERING_PROFILE_CREATING")
                },
                pages: pages,
                save:  function(options) {
                    saveModel(options);
                },
                onCancel: _.bind(function() {
                    self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
                    self.activity.finish();
                    self.activity.overlay.destroy();
                }, self),
                onDone: _.bind(function() {
                    self.activity.overlay.destroy();
                }, self)
            });

            // Save model
            var saveModel = function(options) {
                self.model.save(null,{
                    success: function(model, response) {
                        var json = model.toJSON();
                        json = json[model.jsonRoot];

                        // Set result to the grid
                        self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_OK, json);
                        self.activity.finish();
                        // Invoke the success process of wizard
                        options.success(self.context.getMessage("utm_content_filtering_create_success", [model.get("name")]));
                    },
                    error: function(model, response) {
                        var message;

                        try {
                            message = JSON.parse(response.responseText);
                            message = (message.title) ? message.title + ': ' + message.message : message.message;
                        } catch (e) {
                            message = response.responseText || response;
                        }
                        // Invoke the error process of wizard
                        options.error(message);
                    }
                });
            };
            return this;
        },

        render: function() {
            this.wizard.build();
            return this;
        }
    });

    return ContentFilteringWizardView;
});
