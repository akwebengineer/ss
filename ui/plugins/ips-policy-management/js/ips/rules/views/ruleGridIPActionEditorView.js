/**
 * IP Action editor view that extends from base cellEditor
 *
 * @module ruleGridIPActionEditorView
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    '../../../../../base-policy-management/js/policy-management/rules/views/baseCellEditorView.js',
    'widgets/form/formWidget',
    '../conf/ipActionEditorFormConfiguration.js',
    '../constants/ipsRuleGridConstants.js'
], function (Backbone, Syphon,BaseRulesView,FormWidget, IPActionEditorFormConfiguration,IpsRuleConstants) {
    var ruleGridIPActionEditorView = BaseRulesView.extend({

        events: {
            'click #btnOk': 'updateDataOnGridAndCache',
            'click #linkCancel': 'closeOverlay'
        },

        initialize: function () {
            this.context = this.options.context;
            this.model = this.options.model;
            this.ipActionEditorFormConfiguration = new IPActionEditorFormConfiguration(this.context);
        },

        render : function(){
            var self = this;

            this.form = new FormWidget({
                "elements": this.ipActionEditorFormConfiguration.getElements(),
                "container": this.el
            });

            this.form.build();
            this.populateForm();

            return this;
        },

        populateForm: function(){
            var self = this;
            if(self.model != undefined){
                var configData = self.model.get('config-data');
                if(configData != undefined){
                    if(configData['ip-action'] != undefined){
                        self.$el.find('#ip-action').val(configData['ip-action']);
                    }
                    if(configData['target'] != undefined){
                        self.$el.find('#target').val(configData['target']);
                    }
                    if(configData['refresh-timeout'] != undefined){
                        self.$el.find('#refresh-timeout').attr("checked",configData['refresh-timeout']);
                    }
                    if(configData['log'] != undefined){
                        self.$el.find('#log').attr("checked",configData['log']);
                    }
                    if(configData['log-create'] != undefined){
                        self.$el.find('#log-create').attr("checked",configData['log-create']);
                    }
                    if(configData['timeout'] != undefined){
                        self.$el.find('#timeout').val(configData['timeout'] );
                    }
               }
            }

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
                    'log-attacks': configData["log-attacks"],
                    'alert': configData["alert"],
                    'packet-log': configData["packet-log"],
                    'pre-attack': configData["pre-attack"],
                    'post-attack':configData["post-attack"],
                    'post-attack-timeout': configData["post-attack-timeout"],
                    'ip-action': data["ip-action"],
                    'target': data["target"],
                    'refresh-timeout': data["refresh-timeout"],
                    'timeout': data["timeout"],
                    'log':data["log"],
                    'log-create': data["log-create"]
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

    return ruleGridIPActionEditorView;
});