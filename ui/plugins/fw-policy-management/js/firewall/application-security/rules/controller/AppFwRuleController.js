/*
 Application Firewall rule grid controller
 */
define([
    'widgets/overlay/overlayWidget',
    '../../../../../../base-policy-management/js/policy-management/rules/controller/baseRuleController.js',
    '../../AppFwConstants.js',
    '../model/AppFwRulesCollection.js',
    '../views/AppFwRulesView.js',
    '../views/AppFwCreateRuleForm.js',
     'widgets/confirmationDialog/confirmationDialogWidget'
], function (OverlayWidget, BaseController, AppFwConstants, RuleCollection, AppFwRulesView, AppFwRuleForm, ConfirmationDialogWidget) {

    var AppFwRuleController = function (options) {
        var me = this;
        me.activity = options;
        me.setContext(options);
        me.initialize(AppFwConstants, RuleCollection, AppFwRulesView);
    };

    _.extend(AppFwRuleController.prototype, BaseController.prototype, {

      ENABLE_LOCKING: false,

        initialize: function () {
            BaseController.prototype.initialize.apply(this, arguments);
        },
        /*
         Handler for creating the rule
         Launches the rule creation overlay
         */
        createRuleHandler: function () {
            var me = this, createFormView;
            createFormView = new AppFwRuleForm({
                context: me.context,
                parentView: me.view,
                policyObj: me.policyObj,                
                cuid: me.cuid,
                formMode: 'CREATE'
            });
            me.overlay = new OverlayWidget({
                view: createFormView,
                type: 'xlarge',
                showScrollbar: true
            });

            me.overlay.build();
            if(!me.overlay.getOverlayContainer().hasClass(me.context["ctx_name"])){
                me.overlay.getOverlayContainer().addClass(me.context["ctx_name"]);
            }
        },

        /*
         Handler for mmodifying the rule
         Launches the rule creation overlay in edit mode

         */
        editRuleHandler: function (gridRowsObject) {
            var me = this, createFormView;

            // check if it is a rule group object:
            if (gridRowsObject.originalData['rule-type'] === "RULEGROUP") {
                console.log("Is a rule group. Can be edited only through the rule group options");
                return;
            }


            // create form
            createFormView = new AppFwRuleForm({
                context: me.context,
                parentView: me.view,
                policyObj: me.policyObj,
                rowObject: gridRowsObject,
                formMode: 'EDIT'
            });
            me.overlay = new OverlayWidget({
                view: createFormView,
                type: 'xlarge',
                showScrollbar: true
            });

            me.overlay.build();
            if(!me.overlay.getOverlayContainer().hasClass(me.context["ctx_name"])){
                me.overlay.getOverlayContainer().addClass(me.context["ctx_name"]);
            }
        },
        saveAsPolicyYesButtonCallback: function(){
            this.policySaveAs();
        },
        saveAsPolicyNoButtonCallback : function(){
            var self=this;
            /*self.ruleCollection.resetStore($.proxy(function(response,status) {
                self.ruleCollection.trigger('refresh-page', {}, true);
            }));*/
            //self.ruleCollection.trigger('refresh-page', {}, true);
            self.reloadPage();
            this.view.policyDetailsFormView.setPageData();
        },

        getPolicyObject : function(data){
          return data && data["app-fw-policy"] && data["app-fw-policy"]["id"]? data["app-fw-policy"] : undefined;
        },

        policySaveAs: function(){
            var intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_CLONE',{ mime_type: 'appSecur/json' });
              intent.putExtras({id: this.policyObj.id, cuid: this.cuid});
              this.context.startActivity(intent);
        }
    });
    return AppFwRuleController;
});