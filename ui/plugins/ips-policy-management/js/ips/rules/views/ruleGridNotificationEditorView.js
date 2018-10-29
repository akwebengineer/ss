/**
 * Notification editor view that extends from base cellEditor
 *
 * @module ruleGridNotificationEditorView
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/notificationEditorFormConfiguration.js',
    '../../../../../base-policy-management/js/policy-management/rules/views/baseCellEditorView.js',
    '../constants/ipsRuleGridConstants.js'
], function (Backbone, Syphon,FormWidget, NotificationEditorFormConfiguration,BaseRulesView,IpsRuleConstants) {
    var ruleGridNotificationEditorView = BaseRulesView.extend({

        events: {
            'click #btnOk': 'updateDataOnGridAndCache',
            'click #linkCancel': 'closeOverlay'
        },

        initialize: function () {
            this.context = this.options.context;
            this.notificationEditorFormConfiguration = new NotificationEditorFormConfiguration(this.context);
        },

        render : function(){
            var self = this;

            this.form = new FormWidget({
                "elements": this.notificationEditorFormConfiguration.getElements(),
                "container": this.el
            });

            this.form.build();
            this.initializeForm();
            this.bindChangeEvent();
            this.populateForm();

            return this;
        },

        fieldsForlogPacketsDisable : function(flag){
            var self = this;
            self.$el.find('#pre-attack').prop( "disabled", flag );
            self.$el.find('#post-attack').prop( "disabled", flag );
            self.$el.find('#post-attack-timeout').prop( "disabled", flag )
        },

        alertDisable : function(flag){
            var self = this;
            self.$el.find('#alert').prop( "disabled", flag );
        },

        //Disable alert and log packets related fields at initalization
        initializeForm : function(){
            var self = this;
            self.alertDisable(true);
            self.fieldsForlogPacketsDisable(true);
        },

        bindChangeEvent : function(){
          var self = this;
          self.$('#log-attacks').click(function() {
             if(self.$('#log-attacks').is(':checked')){
                self.alertDisable(false);
             }else{
                self.$el.find('#alert').attr("checked",false);
                self.alertDisable(true);
             }
          });
          self.$('#packet-log').click(function() {
             if(self.$('#packet-log').is(':checked')){
                self.fieldsForlogPacketsDisable(false);
             }else{
                self.$el.find('#pre-attack').val('');
                self.$el.find('#post-attack').val('');
                self.$el.find('#post-attack-timeout').val('');
                self.fieldsForlogPacketsDisable(true);
             }
          });
        },

        populateForm: function(){
            var self = this;
            if(self.model != undefined){
                var configData = self.model.get('config-data');
                if(configData != undefined){
                    if(configData['log-attacks'] != undefined){
                        self.$el.find('#log-attacks').attr("checked",configData['log-attacks']);
                        if(configData['log-attacks'] === true){
                          self.alertDisable(false);
                        }
                    }
                    if(configData['alert'] != undefined){
                        self.$el.find('#alert').attr("checked",configData['alert']);
                    }
                    if(configData['packet-log'] != undefined){
                        self.$el.find('#packet-log').attr("checked",configData['packet-log']);
                        if(configData['packet-log'] === true){
                             self.fieldsForlogPacketsDisable(false);
                        }
                    }
                   if(configData['pre-attack'] != undefined){
                        self.$el.find('#pre-attack').val(configData['pre-attack']);
                    }
                    if(configData['post-attack'] != undefined){
                        self.$el.find('#post-attack').val(configData['post-attack']);
                    }
                    if(configData['post-attack-timeout'] != undefined){
                        self.$el.find('#post-attack-timeout').val(configData['post-attack-timeout']);
                    }
               }
            }

        },

        getValuesFromEditor: function () {
           
        },

        updateModel: function (e) {
            var self = this;
            var data = Syphon.serialize(this);
            var configData = self.model.get('config-data');
            if(configData != undefined){
                self.model.set({
                'config-data':{
                    'severity':configData["severity"],
                    'terminal':configData["terminal"],
                    'log-attacks': data["log-attacks"],
                    'alert': data["alert"],
                    'packet-log': data["packet-log"],
                    'pre-attack': data["pre-attack"],
                    'post-attack':data["post-attack"],
                    'post-attack-timeout': data["post-attack-timeout"],
                    'ip-action': configData["ip-action"],
                    'target': configData["target"],
                    'refresh-timeout': configData["refresh-timeout"],
                    'timeout': configData["timeout"],
                    'log':configData["log"],
                    'log-create': configData["log-create"]
                }
            });
                self.editCompleted(e,this.model);
            }
        },


        updateDataOnGridAndCache: function (e) {
            this.updateModel(e);
            this.closeOverlay(e);           
        },

        saveEditorValuesToCache: function (updatedValuesForAPICall) {
            
        },

        closeOverlay: function (e) {
            this.options.close(this.options.columnName, e);
        },

        setCellViewValues: function (rowData) {
            // to get the values from the grid cell in this view
            this.model = this.options.ruleCollection.get(rowData.originalRowData[IpsRuleConstants.JSON_ID]);
        }

    });

    return ruleGridNotificationEditorView;
});