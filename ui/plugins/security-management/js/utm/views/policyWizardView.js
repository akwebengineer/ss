define([
  'widgets/shortWizard/shortWizard',
  '../views/policyWelcomeView.js',
  '../views/policyGeneralFormView.js',
  '../views/policyWebFilteringFormView.js',
  '../views/policyAntiVirusFormView.js',
  '../views/policyAntiSpamFormView.js',
  '../views/policyContentFilteringFormView.js',
  '../../../../ui-common/js/views/apiResourceView.js'
  ], function(ShortWizard,
          WelcomeView,
          GeneralFormView,
          WebFilteringFormView,
          AntiVirusFormView,
          AntiSpamFormView,
          ContentFilteringView,
          ResourceView){
    var PolicyWizardView = ResourceView.extend({

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
                title: this.context.getMessage('utm_policy_general'),
                view: new GeneralFormView({
                    context: this.context,
                    model: this.model,
                    wizardView: this
                })
            });

            // Web Filtering view
            pages.push({
                title: this.context.getMessage('utm_policy_grid_column_web_filtering'),
                view: new WebFilteringFormView({
                    context: this.context,
                    model: this.model
                })
            });

            // Anti Virus view
            pages.push({
                title: this.context.getMessage('utm_policy_grid_column_anti_virus'),
                view: new AntiVirusFormView({
                    context: this.context,
                    model: this.model
                })
            });

            // Anti Spam view
            pages.push({
                title: this.context.getMessage('utm_policy_grid_column_anti_spam'),
                view: new AntiSpamFormView({
                    context: this.context,
                    model: this.model
                })
            });

            // Content Filtering views
            pages.push({
                title: this.context.getMessage('utm_policy_grid_column_content_filtering'),
                view: new ContentFilteringView({
                    context: this.context,
                    model: this.model
                })
            });

            this.wizard = new ShortWizard({
                container: this.el,
                title: this.context.getMessage('utm_policy_create'),
                titleHelp: {
                    "content": this.context.getMessage("utm_policy_create_wizard_tooltip"),
                    "ua-help-text": this.context.getMessage('more_link'),
                    "ua-help-identifier": this.context.getHelpKey("UTM_POLICY_CREATING")
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
                        options.success(self.context.getMessage("utm_policy_create_success", [model.get("name")]));
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

    return PolicyWizardView;
});
