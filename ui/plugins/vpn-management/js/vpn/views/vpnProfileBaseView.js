/**
 * A view that uses the Tab Container Widget to render a tab container.
 
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
     '../../../../ui-common/js/views/apiResourceView.js',
    'widgets/tabContainer/tabContainerWidget',
     './phase1View.js',
    './phase2View.js'
    
],  function (Backbone, 
        Syphon, 
        FormWidget,  
        ResourceView, 
        TabContainerWidget,Phase1View, Phase2View) {

        var TabContainerView = ResourceView.extend({
            /**
             *  Initialize all the view require params
             */
            initialize: function(options){
                 ResourceView.prototype.initialize.call(this, options);
            },
            addDynamicFormConfig: function(formConfiguration) {
                ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            },
            /* create the tab widget */
            addTabWidget : function(id) {
//                debugger;
                var tabWidgetContainer = this.$el.find('.tab-widget').empty(),
                phase1Model = this.model ? new Backbone.Model(this.model.get("phase1-setting")) : new Backbone.Model(),
                phase2Model = this.model ? new Backbone.Model(this.model.get("phase2-setting")) : new Backbone.Model(),
                contextVal  = this.activity ? this.activity.getContext() : this.context;
                this.tabs = [{
                        id : "phase1-setting",
                        name : this.context.getMessage("vpn_profiles_tab_phase1"),
                        content : new Phase1View({
                            context : contextVal,
                            model : phase1Model,
                            formMode : this.formMode
                        })
                    },{
                        id : "phase2-setting",
                        name : this.context.getMessage("vpn_profiles_tab_phase2"),
                        content : new Phase2View({
                            context : contextVal,
                            model : phase2Model,
                            formMode : this.formMode
                        })
                }];
                this.tabContainerWidget = new TabContainerWidget({
                    "container": tabWidgetContainer,
                    "tabs": this.tabs
                });
                this.tabContainerWidget.build();
            },
            destroytabContainerWidget : function() {
                this.tabContainerWidget.destroy();
            },
            /* validation for Duplicate Val */
            checkDuplicateVal : function(arrayDuplicate) {
                var i, j;
               for(i = 0; i <= arrayDuplicate.length; i++) {
                   for(j = i; j <= arrayDuplicate.length; j++) {
                       if(i != j && arrayDuplicate[i] == arrayDuplicate[j]) {
                           return true;
                       }
                   }
               }
                return false;
            },
            
            /* validation for tab fields - phase1 & phase2 */
            vpnTabValidation : function (profile , obj) {
                var self = obj, customData, customDataName = [];
                
                self.tabs[0].content.customGrid.removeEditModeOnRow();
                self.tabs[1].content.customGrid.removeEditModeOnRow();
              
                if (self.form.isValidInput(self.$el.find('form'))) {
                  
                    //These two lines are added as workaround for issue in form showFormError() method
                    //displays error message in main form as well as inside in each of tab widget.
                  
                   if(profile["phase1-setting"]["phase1-proposal-type"] === "CUSTOM") {
                        if(profile["phase1-setting"]["custom-phase1-proposals"]["phase1-proposal"].length <= 0) {
                            self.form.showFormError(self.context.getMessage("vpn_proposal_phase1_empty_list_error"));
                            return false;
                        }
                         customData = profile["phase1-setting"]["custom-phase1-proposals"]["phase1-proposal"];
                        customData.forEach(function (object) {
                         if(object['name'] !== "")  customDataName.push(object['name']);
                        });
                        if(this.checkDuplicateVal(customDataName)){
                             self.form.showFormError(self.context.getMessage("vpn_proposal_phase1_duplicate_error"));
                            return false;
                        }
                    }

                    if(profile["phase2-setting"]["phase2-proposal-type"] === "CUSTOM") {
                        if(profile["phase2-setting"]["custom-phase2-proposals"]["phase2-proposal"].length <= 0) {
                            self.form.showFormError(self.context.getMessage("vpn_proposal_phase2_empty_list_error"));
                            return;
                        }
                         customData = profile["phase2-setting"]["custom-phase2-proposals"]["phase2-proposal"];
                        customData.forEach(function (object) {
                         if(object['name'] !== "") customDataName.push(object['name']);
                        });
                        if(this.checkDuplicateVal(customDataName)){
                            self.form.showFormError(self.context.getMessage("vpn_proposal_phase2_duplicate_error"));
                            return false;
                        }
                    }
                    if(!profile["phase1-setting"]["nat-traversal-keep-alive"].match(/^$|^[0-9]+$/)){
                           self.form.showFormError(self.context.getMessage("vpn_profile_form_field_range_error", ["1", "300"]));
                           return false;
                    }

                    if(!profile["phase1-setting"]["dpd-interval"].match(/^$|^[0-9]+$/)){
                           self.form.showFormError(self.context.getMessage("vpn_profile_form_field_range_error", ["10", "60"]));
                           return false;
                    }

                    if(!profile["phase2-setting"]["idle-time"].match(/^$|^[0-9]+$/)){
                           self.form.showFormError(self.context.getMessage("vpn_profile_form_field_range_error", ["60", "999999"]));
                           return false;
                    }
                }
                return true;
            }
            
        });

    return TabContainerView;
});