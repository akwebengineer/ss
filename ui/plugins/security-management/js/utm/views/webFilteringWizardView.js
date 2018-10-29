define([
  'backbone',
  'widgets/shortWizard/shortWizard',
  '../views/webFilteringWelcomeView.js',
  '../views/webFilteringGeneralFormView.js',
  '../views/webFilteringUrlCategoryFormView.js',
  '../views/webFilteringFallbackOptionFormView.js',
  '../../../../ui-common/js/views/apiResourceView.js'
  ], function(Backbone,
          ShortWizard,
          WelcomeView,
          GeneralFormView,
          UrlCategoryFormView,
          FallbackOptionFormView,
          ResourceView){
    // types of action list
    var ACTION_TYPE_DENY = "deny",
        ACTION_TYPE_LOG_AND_PERMIT = "log-and-permit",
        ACTION_TYPE_PERMIT = "permit",
        ACTION_TYPE_QUARANTINE = "quarantine";
    // Action
    var ACTION_LOG_AND_PERMIT = "LOG_AND_PERMIT",
        ACTION_BLOCK = "BLOCK",
        ACTION_PERMIT = "PERMIT",
        ACTION_QUARANTINE = "QUARANTINE";

    var WebFilteringWizardView = ResourceView.extend({

        initialize: function (options) {
            var self = this,
                pages = [];

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
                title: this.context.getMessage('utm_web_filtering_general'),
                view: new GeneralFormView({
                    context: this.context,
                    model: this.model,
                    wizardView: this
                })
            });

            // URL category view
            pages.push({
                title: this.context.getMessage('utm_web_filtering_url_category'),
                view: new UrlCategoryFormView({
                    context: this.context,
                    model: this.model
                })
            });

            // Fallback option view
            pages.push({
                title: this.context.getMessage('utm_web_filtering_fallback_option'),
                view: new FallbackOptionFormView({
                    context: this.context,
                    model: this.model
                })
            });

            this.wizard = new ShortWizard({
                container: this.el,
                title: this.context.getMessage('utm_web_filtering_create'),
                titleHelp: {
                    "content": this.context.getMessage("utm_web_filtering_create_wizard_tooltip"),
                    "ua-help-text": this.context.getMessage('more_link'),
                    "ua-help-identifier": this.context.getHelpKey("UTM_WEB_FILTERING_PROFILE_CREATING")
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
                self.beforeSave();
                self.model.save(null,{
                    success: function(model, response) {
                        var json = model.toJSON();
                        json = json[model.jsonRoot];

                        // Set result to the grid
                        self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_OK, json);
                        self.activity.finish();
                        // Invoke the success process of wizard
                        options.success(self.context.getMessage("utm_web_filtering_create_success", [model.get("name")]));
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
        },

        editUrlCategoryJsonData: function(action, urlCategoryList) {
            var list = this.model.get(action.type+"-action-list");

            if (list && list.length > 0) {
                for (var i=0; i<list.length; i++) {
                    urlCategoryList.push(
                        {
                            "action": action.value,
                            "url-category-list": {
                                id: list[i].value,
                                name: list[i].label
                            }
                        }
                    );
                }
            }

            return urlCategoryList;
        },
        beforeSave: function() {
            this.model.set("definition-type", "CUSTOM");

            // Set json data for "url-category-list"
            var actionNames = [
                   {
                       type: ACTION_TYPE_DENY,
                       value: ACTION_BLOCK
                   },
                   {
                       type: ACTION_TYPE_LOG_AND_PERMIT,
                       value: ACTION_LOG_AND_PERMIT
                   },
                   {
                       type: ACTION_TYPE_PERMIT,
                       value: ACTION_PERMIT
                   },
                   {
                       type: ACTION_TYPE_QUARANTINE,
                       value: ACTION_QUARANTINE
                   }
            ],
            urlCategoryList = [];

            for (var i=0; i<actionNames.length; i++) {
                this.editUrlCategoryJsonData(actionNames[i], urlCategoryList);
            }

            this.model.set("url-category-action-list", {"url-category-action": urlCategoryList});

            // Set json data for "site-reputation-actions"
            if (this.model.get("enable-global-reputation")) {
                this.model.set("site-reputation-actions", {
                    "moderately-safe": this.model.get("moderately-safe"),
                    "harmful": this.model.get("harmful"),
                    "suspicious": this.model.get("suspicious"),
                    "very-safe": this.model.get("very-safe"),
                    "fairly-safe": this.model.get("fairly-safe")
                });
            } else {
                this.model.unset('site-reputation-actions');
            }
        }
    });

    return WebFilteringWizardView;
});
