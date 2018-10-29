/**
 * View to create Policy Profile
 *
 * @module PolicyProfileView
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/tabContainer/tabContainerWidget',
    '../conf/policyProfileDetailedViewConf.js',
    '../models/policyProfileModel.js',
    '../models/policyProfileCollection.js',
    '../../../../../ui-common/js/views/apiResourceView.js',
    './loggingDetailedView.js',
    './authenticationDetailedView.js',
    './advancedSettingsDetailedView.js'
    ]
    ,function(Backbone, Syphon, FormWidget, TabContainerWidget, PolicyProfileFormConf, PolicyProfileModel, PolicyProfileCollection, ResourceView, LoggingView, AuthenticationView, AdvancedSettingsView){
       
        var PolicyProfileView = ResourceView.extend({
            events: {
                "click #cancel" : 'cancel'
            },
            initialize: function(options){
                ResourceView.prototype.initialize.call(this, options);
            },

            render: function(){
                var self = this;

                var policyProfileConfiguration = new PolicyProfileFormConf(this.activity.getContext());
                var formElements = policyProfileConfiguration.getValues();
                this.formWidget = new FormWidget({
                    'elements': formElements,
                    'container': this.el,
                    'values': this.model.toJSON()[this.model.jsonRoot]
                });
                this.formWidget.build();
                this.addTabWidget('tab-widget');
                this.$el.find('#description').attr('readonly',true);
                this.$el.find('#device_template').html("<label>"+(this.model.get('sd-template').name || 'NONE'+"</label>"));
                return this;
            },
            addTabWidget: function(id, gridConf) {
                var tabWidgetContainer = this.$el.find('.tab-widget').empty();
                var loggingModel = this.model ? new Backbone.Model(this.model.attributes) : new Backbone.Model();
                var authenticationModel = this.model ? new Backbone.Model(this.model.attributes) : new Backbone.Model();
                var advancedSettingsModel = this.model ? new Backbone.Model(this.model.attributes) : new Backbone.Model();
                this.authView = new AuthenticationView({
                                    context : this.activity.getContext(),
                                    model : authenticationModel
                                });
                this.advancedView = new AdvancedSettingsView({
                                    context : this.activity.getContext(),
                                    model : advancedSettingsModel
                                });  
                this.loggingView = new LoggingView({
                                    context : this.activity.getContext(),
                                    model : loggingModel
                                });                      

                this.tabs = [{
                        id : "logging",
                        name : this.context.getMessage("policy_profiles_tab_logging"),
                        content : this.loggingView
                    },{
                        id : "authentication",
                        name : this.context.getMessage("policy_profiles_tab_authentication"),
                        content : this.authView
                    },{
                        id : "advancedSettings",
                        name : this.context.getMessage("policy_profiles_tab_advancedSettings"),
                        content : this.advancedView    
                }];
                this.tabContainerWidget = new TabContainerWidget({
                    "container": tabWidgetContainer,
                    "tabs": this.tabs
                   // "height": "250px"
                });
                this.tabContainerWidget.build();
            }
        });
        return PolicyProfileView;
    });