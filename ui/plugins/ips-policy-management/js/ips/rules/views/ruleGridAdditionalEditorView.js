/**
 * Additional editor view that extends from base cellEditor
 *
 * @module ruleGridAdditionalEditorView
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    '../../../../../base-policy-management/js/policy-management/rules/views/baseCellEditorView.js',
    'widgets/form/formWidget',
    '../conf/additionalEditorFormConfiguration.js',
    '../constants/ipsRuleGridConstants.js'
], function (Backbone, Syphon, BaseRulesView, FormWidget, AdditionalEditorFormConfiguration, IpsRuleConstants) {
    var ruleGridAdditionalEditorView = BaseRulesView.extend({

        events: {
            'click #btnOk': 'updateDataOnGridAndCache',
            'click #linkCancel': 'closeOverlay'
        },

        initialize: function () {
            this.context = this.options.context;
            this.additionalEditorFormConfiguration = new AdditionalEditorFormConfiguration(this.context);
        },

        render : function(){
            var self = this;

            this.form = new FormWidget({
                "elements": this.additionalEditorFormConfiguration.getElements(),
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
                    if(configData['terminal'] != undefined){
                        self.$el.find('#terminal').attr("checked",configData['terminal']);
                    }
                    if(configData['severity'] != undefined){
                        self.$el.find('#severity').val(configData['severity']);
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
                    'severity':data["severity"],
                    'terminal':data["terminal"],
                    'log-attacks': configData["log-attacks"],
                    'alert': configData["alert"],
                    'packet-log': configData["packet-log"],
                    'pre-attack': configData["pre-attack"],
                    'post-attack':configData["post-attack"],
                    'post-attack-timeout': configData["post-attack-timeout"],
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
            this.model = this.options.ruleCollection.get(rowData.originalRowData[IpsRuleConstants.JSON_ID]);
        }


    });

    return ruleGridAdditionalEditorView;
});