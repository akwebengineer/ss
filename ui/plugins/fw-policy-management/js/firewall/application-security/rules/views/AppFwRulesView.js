/**
 * A view to manage application firewall policy rules
 *
 * @module AppFwRulesView
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../../base-policy-management/js/policy-management/rules/views/baseRulesView.js',
    '../conf/AppFwRulesGridConfiguration.js',
    '../conf/appFwRulesContextMenu.js',
    '../../AppFwConstants.js',
    'widgets/form/formWidget',
    '../views/AppFwPolicyDetailsFormView.js',
    'text!../template/AppFwRuleGridTopTemplate.html'
], function (BaseRulesView, RuleGridConf, FirewallRulesContextMenu, PolicyManagementConstants, FormWidget, FormView,
             AppFwRuleGridTopSectionTemplate) {

    var AppFwRulesView = BaseRulesView.extend({
        policyManagementConstants: PolicyManagementConstants,
        /**
         * Returns rules grid configuration
         * @returns {*}
         */
        getRuleGridConfiguration: function () {
            var me = this,
                ruleGrid = new RuleGridConf(me.context, me.ruleCollection, me.policyManagementConstants, me.policyObj),
                ruleGridConfiguration = ruleGrid.getConfiguration(me.policyObj.name);
            // removing the inline edit rule option
            ruleGridConfiguration.editRow = false;
            return ruleGridConfiguration;
        },
         /**
        * Returns true if the Rules ILP has action buttons.
        * Sub classes can override if button buttons has to be hidden
        * @returns {boolean}
        */
        hasRuleGridDiscardButton: function(){
            return true;
        },


        /**
         * Defines the context menu
         * For now, keeping firewall policy context menu
         * TODo will update later
         * @returns {FirewallRulesContextMenu}
         */

        getContextMenu: function () {
            var me = this,
                contextMenu = new FirewallRulesContextMenu(me.context, me.ruleCollection,
                    me.policyManagementConstants);
            return contextMenu;
        },

        /**
        * overriding base class function
        * @returns {boolean}
        */
        hasRuleGridSaveButton: function(){
            return true;
        },

        /**
         * TODO pening implementation
         * @returns {{}}
         */
        createViews: function () {
            var me = this, cellViews = {};
            return cellViews;
        },

        /**
         * returns the gridTable object
         *
         * @returns {*}
         */
        getGridTable: function () {
            return this.$el.find("#appfwRuleGrid");
        },

        /**
         * Override the top section to be hidden
         * @returns {boolean}
         */
        hasRuleGridTopSection: function () {
            return true;
        },

        hasRuleGridBottomSection: function () {
            return true;
        },


        /**
         * It appends Rule grid top section.
         */
        appendRulesGridTopSection: function () {
            var me = this, topSection;
            topSection = Slipstream.SDK.Renderer.render(AppFwRuleGridTopSectionTemplate, {policyName: me.policyObj.name + " / " + me.context.getMessage("rules")});
            me.$el.append(topSection);
        },


        /**
         * Appends a form at the bottom of ILP
         */
        appendRulesGridBottomSection: function () {
            var me = this, bottomSection;
            // adding bottom section
            me.$el.append('<div class="rulegrid_title_section"></div><div class="appfw_rules_bottom_section">');

            // attaching form at the bottom section
            bottomSection = me.$el.find('.appfw_rules_bottom_section');

            // creating form view
            me.policyDetailsFormView = new FormView({
                context: me.context,
                container: bottomSection,
                policyObj: me.policyObj,
                parentView: me
            });

            // calling form creation
            me.policyDetailsFormView.createform();
        },

        /**
         * Handles Save button click action
         */
        handleSavePolicy : function(){
            var me = this, errorText;
            errorText = me.policyDetailsFormView.isFormValid();

            if (!errorText) {
                // in case no error, perform base class save action
                BaseRulesView.prototype.handleSavePolicy.call(this, arguments);
            } else {
                // disable save button and display save error on the top
                me.ruleCollection.trigger("after-policy-save", errorText);
                me.$el.find('#appfw_error_message_text').text(errorText);
            }
        },


        /**
         * Returns the SID for the policy
         * @returns {string} sid
         */
        getSID: function() {
            return 'juniper.net:fw-policy-management:application-firewall-rules-grid';
        }
    });

    return AppFwRulesView;
});
