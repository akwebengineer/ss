/**
 * SubClass for PolicyAnalysis Report.
 * Extends from BaseReportDefCreateView.
 * SubClass must override createContentSection and getContentJsonOjbect and modifyContentSection
 * @module PolicyAnalysisReportView
 * @author Aslam <aslama@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
        'backbone', 
        'widgets/grid/gridWidget',
        '../conf/firewallPolicyGridConfig.js', 
        '../conf/policyAnalysisCreateFormConfig.js',
        './baseReportDefCreateView.js'
], function (Backbone, 
             GridWidget,
             FirewallPolicyGridConfig, 
             PolicyAnalysisCreateFormConfig,
             BaseReportDefCreateView) {

    var  PolicyAnalysisReportView = BaseReportDefCreateView.extend({
        
       render: function(){
            BaseReportDefCreateView.prototype.render.call(this);
            var self=this,
                formConfig = new PolicyAnalysisCreateFormConfig(self.context),
                dynamicSection = formConfig.getValues();
            //
            self.form.addSection(dynamicSection, "#report-create-content-section", true);
            self.buildFirewallPolicyGrid();
            self.buildAnomalies();
            //
            return self;
       },
       //
       buildAnomalies: function(){
            var me=this,
                policyContent = me.model.get('policy-analysis-content'),
                anomalies = policyContent && policyContent['anomalies']['anomalies'];
            //
            if(policyContent && anomalies) {
                if(anomalies.length > 0) {
                    for (var i = 0; i<= anomalies.length; i++) {
                        switch(anomalies[i]){
                            case 'SHADOWED':
                                this.$el.find("#anomalies1").attr("checked", true);
                                break;
                            case 'REDUNDANT':
                                this.$el.find("#anomalies2").attr("checked", true);
                                break;
                            case 'UNUSED_RULES':
                                this.$el.find("#anomalies3").attr("checked", true);
                                break;
                            case 'EXPIRED_SCHEDULER':
                                this.$el.find("#anomalies4").attr("checked", true);
                                break;
                            case 'LOGGING_DISABLED':
                                this.$el.find("#anomalies5").attr("checked", true);
                                break;
                        }
                    }
                }
            };
       },
       //
       buildFirewallPolicyGrid: function () {
            var me=this,
                policyGridContainer = this.$el.find('#firewall-policy-grid-report'),
                policyContent = me.model.get('policy-analysis-content'),
                policyGridConf = new FirewallPolicyGridConfig(this.context);

            this.policyGrid = new GridWidget({
                container: policyGridContainer,
                elements: policyGridConf.getValues()
            });
            this.policyGrid.build();
            
            if(policyContent){
                this.$el.find("#policies_reports_tableID").on("gridLoaded", function(){
                    me.policyGrid.toggleRowSelection([me.model.get('policy-analysis-content')['firewall-policy']], "selected");
                });
            }
            policyGridContainer.find('.grid-widget').addClass("elementinput-long");
       },
       //
       isValid: function(){
            var me=this,
                isValid = BaseReportDefCreateView.prototype.isValid.call(me);
            if(isValid){
                if(!me.policyGrid.getSelectedRows() || me.policyGrid.getSelectedRows().length === 0) {
                    me.form.showFormError(me.context.getMessage("report_def_field_firewall_policy_error"));
                    isValid = false;
                }
            }
            return isValid;
       },
       //
       getJsonReportObj : function(successCallBack){            

            var self = this, 
                anomalies = [],
                policyIds, 
                jsonDataObj={},
                success,
                contentJson= {};
            success = function(jsonDataObj){
                $.each($("input[name='anomalies']:checked"), function(){
                    anomalies.push($(this).val());
                });

                if(self.policyGrid.getSelectedRows()[0] !== undefined){
                    policyIds = self.policyGrid.getSelectedRows()[0].id;
                }
                
                contentJson  =   {
                        "firewall-policy": policyIds,
                        "anomalies": {
                            "anomalies": anomalies
                        }
                };
                jsonDataObj["policy-analysis-content"] = contentJson;
                successCallBack(jsonDataObj);
            }
            BaseReportDefCreateView.prototype.getJsonReportObj.call(this, success)
       }

    });

    return PolicyAnalysisReportView;
});

