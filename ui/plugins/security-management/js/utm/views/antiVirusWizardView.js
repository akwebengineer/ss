define([
  'backbone',
  'widgets/shortWizard/shortWizard',
  '../views/antiVirusWelcomeView.js',
  '../views/antiVirusGeneralView.js',
  '../views/antiVirusFallbackView.js',
  '../views/antiVirusNotificationView.js',
  '../../../../ui-common/js/views/apiResourceView.js'
  ], function(Backbone,
          ShortWizard,
          antiVirusWelcomeView,
          antiVirusGeneralView,
          antiVirusFallbackView,
          antiVirusNotificationView,
          ResourceView){
    var antiVirusWizardView = ResourceView.extend({

      initialize: function (options) {
        var self = this, pages = new Array();

        ResourceView.prototype.initialize.call(this, options);

        pages.push({
          title: "",
          view: new antiVirusWelcomeView({
            context: this.context
          }),
          intro: true
        });

        pages.push({
          title: this.context.getMessage('utm_antivirus_profile_general'),
          view: new antiVirusGeneralView({
            context: this.context,
            model: this.model,
            wizardView: this
          })
        });

        pages.push({
          title: this.context.getMessage('utm_antivirus_profile_fallback'),
          view: new antiVirusFallbackView({
            context: this.context,
            model: this.model
          })
        });

        pages.push({
          title: this.context.getMessage('utm_antivirus_profile_nitification'),
          view: new antiVirusNotificationView({
            context: this.context,
            model: this.model
          })
        });

        this.wizard = new ShortWizard({
          container: this.el,
          title: this.context.getMessage('utm_antivirus_profile_create'),
          titleHelp: {
              "content": this.context.getMessage("utm_antivirus_create_wizard_tooltip"),
              "ua-help-text": this.context.getMessage('more_link'),
              "ua-help-identifier": this.context.getHelpKey("UTM_ANTIVIRUS_PROFILE_CREATING")
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

        var saveModel = function(options) {
            self.model.save(null,{
                success: function(model, response) {
                    var json = model.toJSON();

                    json = json[model.jsonRoot];

                    // Set result to the grid
                    self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_OK, json);
                    self.activity.finish();

                    // Invoke the success process of wizard
                    options.success(self.context.getMessage("utm_antivirus_create_success", [model.get("name")]));
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

  return antiVirusWizardView;
});
