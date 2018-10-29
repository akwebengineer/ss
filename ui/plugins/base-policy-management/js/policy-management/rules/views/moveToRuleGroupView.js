/**
 * Firewall move to rule group view 
 *
 * @module FWMoveToRuleGroupView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
     'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/dropDown/dropDownWidget',
    '../conf/moveToRuleGroupFormConfiguration.js',
    '../models/ruleGroupCollection.js'
], function (Backbone, Syphon, FormWidget, DropDownWidget, MoveToRuleGroupFormConfiguration, RuleGroupCollection) {

    var MoveToRuleGroupEditorView = Backbone.View.extend({

        events: {
            'click #btnOk': 'saveRuleGroup',
            'click #linkCancel': 'closeOverlay'
        },

        initialize: function () {
            this.context = this.options.context;
            this.policyManagementConstants = this.options.policyManagementConstants;

            this.formConfiguration = new MoveToRuleGroupFormConfiguration(this.context);
            this.ruleGroupCollection = new RuleGroupCollection(this.options.policyId, this.options.policyManagementConstants, this.options.ruleCollection.cuid);
        },

        render: function () {
            var self = this;
            this.form = new FormWidget({
                "elements": this.formConfiguration.moveToRuleGroup(),
                "container": this.el
            });

            this.form.build();


            var ruleGroupEditor = this.$el.find('#ruleGroup').parent();
            $(ruleGroupEditor).empty();
            var $span =  $(ruleGroupEditor).append('<select class="rulegroupeditor"  style="width: 100%"></select>');
            var widgetConf = {
                "container": $span.find('.rulegroupeditor'),
                "data": [{"id": "", "text":""}],
                "enableSearch": true,
                "placeholder" : this.context.getMessage("selectRuleGroup"),
                "onChange" :function(){
                    if(this.value !== ""){
                        self.$el.find(".gridRuleGrp").removeClass("error");
                    }
                }
            };
//            widgetConf.placeholder = this.context.getMessage("selectRuleGroup");
            this.ruleGroupDropDown = new DropDownWidget(widgetConf).build();

            this.getRuleGroups();

            return this;
        },

        /**
         * Get the rule groups
         **/
        getRuleGroups: function () {
            var self = this;

            this.ruleGroupCollection.fetch({
                success: function (collection, response, options) {
                    var ruleGroup = response['ruleCollection']['rules'];
                    if (!$.isEmptyObject(ruleGroup)) {
                        if(!$.isArray(ruleGroup)){
                          ruleGroup = [ruleGroup];
                        }
                        var selectData = [];
                        var isGlobalRuleSelected = self.options.isGlobalRuleSelected;
                        ruleGroup.forEach(function (object) {
                            var isGlobalRule = object["global-rule"];
                            if(isGlobalRuleSelected === isGlobalRule){
                                selectData.push({id:object[self.policyManagementConstants.JSON_ID],text:object.name});
                            }
                        });
                        self.ruleGroupDropDown.addData(selectData);
                    }
                },
                error: function (collection, response, options) {
                    console.log('Firewall rule group collection not fetched');
                }
            });
        },

        saveRuleGroup: function (e) {

            e.preventDefault();
            if (this.ruleGroupDropDown.getValue() !== "") {
                this.options.moveRulesToGroup(this.options.selections, this.ruleGroupDropDown.getValue());
                this.closeOverlay(e);
            }else{
                this.$el.find(".gridRuleGrp").addClass("error");
            }
        },

        closeOverlay: function (e) {
            this.options.close(e);
        }

    });

    return MoveToRuleGroupEditorView;
});