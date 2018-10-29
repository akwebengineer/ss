/**
 *  Create Alert Wizard View 
 *
 *  @module EventViewer
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([
    'backbone',
    'widgets/shortWizard/shortWizard',
    './generalAlertView.js',
    './filterAlertView.js',
    './emailAlertView.js',
    '../models/alertDefinitionModel.js'
    ], function(
           Backbone,
           ShortWizard,
           GeneralAlertView,
           FilterAlertView,
           EmailAlertView,
           AlertDefinitionModel
           ){

    var AlertWizardView = Backbone.View.extend({

        initialize: function (options) {
            this.activity = this.options.activity;
            this.context = this.options.context;
            this.filterObj = this.options.filterObj;
            var self = this, pages = new Array();
            this.model = new AlertDefinitionModel();

            pages.push({
                title: this.context.getMessage('ev_create_alert_general_page_title'),
                view: new GeneralAlertView({
                    "context": this.context,
                    "page": 0,
                    model: this.model
                })
            });

            pages.push({
                title: this.context.getMessage('ev_create_alert_filter_page_title'),
                view: new FilterAlertView({
                   "context": this.context,
                    "page": 1,
                    model: this.model,
                    "filterObj": this.filterObj
                })
            });

            pages.push({
                title: this.context.getMessage('ev_create_alert_email_page_title'),
                view: new EmailAlertView({
                   "context": this.context,
                   "page": 2,
                   model: this.model
                })
            });

            this.wizard = new ShortWizard({
                container: this.el,
                title: this.context.getMessage('ev_create_alert_wizard_title'),
                titleHelp:{
                           "content": this.context.getMessage('alert_def_form_create_title_help'),
                           "ua-help-text":this.context.getMessage("more_link"),
                           "ua-help-identifier": this.context.getHelpKey("EVENT_LOG_ALERT_CREATING")
                },
                pages: pages,
                model: this.model,
                save:  function(options) {
                    saveModel(self, options, this.model);
                },
                onCancel: _.bind(function() {
                    this.activity.overlayWidgetObj.destroy();
                }, this),
                onDone: _.bind(function() {
                    this.activity.overlayWidgetObj.destroy();
                }, this)

            });

            var saveModel = function(self, options, model) {
                this.model = model;
                this.model.save(null,{
                    success: function(model, response) {
                        console.log(response);
                        var json = model.toJSON();

                        json = json[model.jsonRoot];
                        // Invoke the success process of wizard
                        options.success(self.context.getMessage("ev_create_alert_success", [model.get("name")]));
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

  return AlertWizardView;
});