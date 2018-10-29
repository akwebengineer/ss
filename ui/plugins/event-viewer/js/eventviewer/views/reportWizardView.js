/**
 *  Create Report Wizard
 *  
 *  @module CreateReport - EventViewer
 *  @author Slipstream Developers <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([
    'backbone',
    'widgets/shortWizard/shortWizard',
    './generalReportView.js',
    './dataCriteriaReportView.js',
    './scheduleReportView.js',
    './emailReportView.js',
    '../models/reportsModel.js'
    ], function(
           Backbone,
           ShortWizard,
           GeneralReportView,
           DataCriteriaReportView,
           ScheduleReportView,
           EmailReportView,
           ReportsModel){

    var ReportWizardView = Backbone.View.extend({

        initialize: function (options) {
            this.activity = this.options.activity;
            this.context = this.options.context;
            this.filterObj = this.options.filterObj;
            var self = this, pages = new Array();
            this.model = new ReportsModel();

            pages.push({
                title: this.context.getMessage('ev_create_report_general_page_title'),
                view: new GeneralReportView({
                    "context": this.context,                    
                    "page": 0,
                    model: this.model
                })
            }); 

            pages.push({
                title: this.context.getMessage('ev_create_report_data_page_title'),
                view: new DataCriteriaReportView({
                    "context": this.context,                    
                    "page": 1,
                    "filterObj": this.filterObj,
                    model: this.model
                })
            }); 

            pages.push({
                title: this.context.getMessage('ev_create_report_schedule_page_title'),
                view: new ScheduleReportView({
                   "context": this.context,                    
                    "page": 2,
                    model: this.model
                })
            });

            pages.push({
                title: this.context.getMessage('ev_create_report_email_page_title'),
                view: new EmailReportView({
                   "context": this.context,                    
                   "page": 3,
                   model: this.model
                })
            });

            this.wizard = new ShortWizard({
                container: this.el,
                title: this.context.getMessage('ev_create_report_wizard_title'),
                titleHelp:{
                   "content": this.context.getMessage('report_def_form_title_tooltip_create_log_report'),
                   "ua-help-text":this.context.getMessage("more_link"),
                   "ua-help-identifier": this.context.getHelpKey("EVENT_LOG_REPORT_CREATING")
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

            var saveModel = function(self,options, model) {
                this.model = model;
                this.model.save(null,{
                    success: function(model, response) {
                        console.log(response);
                        var json = model.toJSON();

                        json = json[model.jsonRoot];
                        // Invoke the success process of wizard
                        options.success(self.context.getMessage("ev_create_report_success", [model.get("name")]));
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

  return ReportWizardView;
});