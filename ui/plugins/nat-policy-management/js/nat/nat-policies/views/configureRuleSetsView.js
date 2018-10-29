/**
 * View to show configure rule sets
 *
 * @module ConfigureRuleSets
 * @author Damodhar M<mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
        'backbone',
        'widgets/form/formWidget',
        'widgets/grid/gridWidget',
        '../conf/configureRuleSetsFormConfiguration.js',
        '../conf/configureRuleSetsGridConfiguration.js',
        '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function (Backbone, FormWidget, GridWidget, FormConf, ConfigureRuleSetsGridConfiguration,NATPolicyManagementConstants) {

    var RULE_NAME_ERROR;
    var ConfigureRuleSetsView = Backbone.View.extend({

        events: {
            'click #btnRuleSetOk': 'submit',
            'click #linkRuleSetCancel': 'closeOverlay'
        },
        submit: function(event) {
            event.preventDefault();
            console.log("this.$el.find('.error')",this.$el.find('.error'));
            if(this.$el.find('.error').length){
                console.log("form is invalid");
                return;
            }
            var self =this,
                ruleSets=this.model.get('policy-rule-set')['rule-sets']['rule-set'];
            
            $.each(this.ruleSetArray, function( key, value ) {
              var indexes = $.map(ruleSets, function(obj, index) {if(obj.id == value.id) {return index;}}),
                  firstIndex = indexes[0];
              ruleSets[firstIndex]['rule-set-name']=value.name;
            });

            var properties = {"policy-rule-set":this.model.get('policy-rule-set')};
            $.ajax({
                url : NATPolicyManagementConstants.getRuleSetsUrl(this.policyId),
                type:'POST',
                jsonRoot: "policy-rule-set",
                contentType: 'application/vnd.juniper.sd.policy-management.nat.policy-rule-set+json;version=3;charset=UTF-8',
                data: JSON.stringify(properties), 
                success :function(data){
                    console.log('rule-sets updated successfully');
                    self.notify("success", self.context.getMessage("nat_policy_configure_rule_sets_success_msg"));
                },
                error: function() {
                    console.log('rule-sets not updated successfully');
                    self.notify("error", self.context.getMessage("nat_policy_configure_rule_sets_error_msg"));
                }
            });
            this.activity.finish();
            this.activity.overlay.destroy();

        },
        closeOverlay: function(event) {
            event.preventDefault();
            this.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
            this.activity.finish();
            this.activity.overlay.destroy();
        },

        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.gridConf = new ConfigureRuleSetsGridConfiguration(this.context,options);
            this.policyId = options.policyId;
            this.model= options.model;              
            this.bindGridEvents();
            this.ruleSetArray = new Array();
        },

        bindGridEvents: function (){
           var self = this;
           this.$el.bind("gridRowOnEditMode", function (e, editModeRow) {
                self.handleRowDataEdit(editModeRow);
            });
        },
        handleRowDataEdit :function(editModeRow){
            var self=this,isNameEdited= false,
            $nameEditor = $(editModeRow.currentRowFields['rule-set-name']);
            $nameEditor.off("change").on("change", function(e){
                e.preventDefault();
                if(!self.checkRuleNameExists(this.value) && self.checkRuleNameRange(this.value)){
                    $(this).parent().removeClass("error");
                    self.$el.find('#error').remove();
                    self.$el.find('#errorId').remove();
                    self.ruleSetArray.push({"id":$(this).attr("rowid"),"name":this.value});
                }else{
                        $(this).parent().append($("<span>", {id: "errorId", class: ""}));
                        $(this).parent().addClass("error");
                        self.$el.find('#errorId').addClass("error").show().text(RULE_NAME_ERROR);
                }
            });
            $nameEditor.off("keyup").on("keyup", function(e){
                e.preventDefault();
                //enable save on first key press
                if(!isNameEdited){
                    isNameEdited = true;
                    self.$el.find('#btnRuleSetOk').removeClass("disabled");
                }
             });
        },
        checkRuleNameExists :function(value){
            var ruleSets =this.model.get('policy-rule-set')['rule-sets']['rule-set'];
            var indexes = $.map(ruleSets, function(obj, index) {if(obj['rule-set-name'] == value) {return index;}});
            RULE_NAME_ERROR=this.context.getMessage('name_duplicate_error');
            return (indexes.length>0);
        },
        checkRuleNameRange :function(value){
            RULE_NAME_ERROR=this.context.getMessage('rulesGrid_column_name_errMsg');
            return (value.length >= 1 && value.length <= 31);
        },
        render: function() {
            var self = this;
            var formConfiguration = new FormConf(this.context);
            var formElements = formConfiguration.getValues();

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });

            this.form.build();
            this.addGridWidget();
            this.$el.find('#btnRuleSetOk').addClass("disabled");
            this.$el.addClass("security-management");
            return this;
        },

     addGridWidget: function() {
            var gridElements = this.gridConf.getValues(this.policyId),
              gridContainer = this.$el.find('#nat_policy_configure_ruleset');
           
            this.gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridElements
            });
            this.gridWidget.build();
        },
        /**
         *  Helper method to display a toast/non-persistent notification
         */
        notify: function(type, message) {
            new Slipstream.SDK.Notification()
                .setText(message)
                .setType(type)
                .notify();
        }
    });

    return ConfigureRuleSetsView;
});
