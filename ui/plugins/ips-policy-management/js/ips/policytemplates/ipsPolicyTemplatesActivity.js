/**
 * Module that implements the ipsPolicyProfileActivity
 *
 * @author Ashish Vyawahare <avyaw@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../ui-common/js/gridActivity.js',
    './conf/ipsPolicyTemplatesGridConf.js',
    './models/ipsPolicyTemplatesModel.js',
    './views/ipsPolicyTemplatesGridView.js',
    './views/ipsPolicyTemplateFormView.js',
    './constants/ipsPolicyTemplatesConstants.js',
    './models/ipsPolicyTemplatesCollection.js',
    './controller/ipsPolicyTemplatesRuleController.js',
    '../../../../ui-common/js/sse/smSSEEventSubscriber.js'
], function(
    GridActivity, IpsPolicyTemplatesGridConf,IpsPolicyTemplateModel, IpsPolicyTemplatesGridView, IpsPolicyTemplateFormView, IpsPolicyTemplateConstant,Collection,IPSPolicyTemplatesRuleController,SmSSEEventSubscriber) {
    /**
     * Construct a IpsPolicyTemplatesActivity
     */
    var IpsPolicytemplateActivity = function () {
        GridActivity.call(this);

        this.model = IpsPolicyTemplateModel;
        this.collection = new Collection();
        this.controller = IPSPolicyTemplatesRuleController;
        this.constants = IpsPolicyTemplateConstant;

        this.getView = function () {
            this.gridConf = new IpsPolicyTemplatesGridConf(this.getContext());
            this.view = new IpsPolicyTemplatesGridView({
                conf: this.gridConf.getValues(),
                activity:this,
                actionEvents: this.events,
                context: this.getContext()
            });
            this.bindEvents();
            this.setContextMenuItemStatus(this.view.conf);
            this.subscribeNotifications();
            return this.view;
        };

        this.capabilities = {
            "create": {
                view: IpsPolicyTemplateFormView,
                rbacCapabilities: ["createIPSPolicy"]
            },
            "edit": {
                view: IpsPolicyTemplateFormView,
                rbacCapabilities: ["modifyIPSPolicy"]
            },
            "clone": {
                view: IpsPolicyTemplateFormView,
                rbacCapabilities: ["createIPSPolicy"]
            },
            "delete": {
                rbacCapabilities: ["deleteIPSPolicy"]
            }
        };

        //need this to call the parent method
        var baseOnListIntent = this.onListIntent;

        //overwrite the list Intent to show the rules view if the policyId is passed in the url
        //else show the policy view
        this.onListIntent = function() {
            var self = this,
            policyId = self.getIntent().getExtras().objectId;
            view = self.getIntent().getExtras().view;
            if(policyId && view === 'rules'){

                //load the policy object using the policyId passed from the policy view
                //TODO add code to handle the filter being passed from the globalsearch
                $.ajax({
                    url: self.constants.IPS_POLICY_TEMPLATE_URL + "/" + policyId,
                    type: 'GET',
                    headers: {
                    Accept: self.constants.IPS_POLICY_TEMPLATE_ACCEPT_HEADER
                    },
                    success: function (data) {
                        var controller = new self.controller({context:self.context, policyObj:data["policy-template"], cuid: Slipstream.SDK.Utils.url_safe_uuid()});
                        self.setContentView(controller.view);
                    },
                    error: function () {
                        console.log("call to fetch policy in base rules activity failed");
                    }
                });
            }else{
                baseOnListIntent.call(this);
            }
        };

        this.bindEvents = function() {
            GridActivity.prototype.bindEvents.call(this);
        }; 

        this.subscribeNotifications = function () {
            //Subscribe to the SSE event
            var self = this;
            var notificationSubscriptionConfig = {
                'uri' : [self.constants.IPS_POLICY_TEMPLATE_URL],
                'autoRefresh' : true,
                'callback' : function () {
                  console.log("Notification received for Ips Policy template page");
                  self.view.gridWidget.reloadGrid();
                }
            };
            var sseEventHandler = $.proxy(notificationSubscriptionConfig.callback, self.view);
            this.sseEventSubscriptions = new SmSSEEventSubscriber().startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);

            return this.sseEventSubscriptions;
        };

        this.onDelete = function(idArr, onDeleteSuccess, onDeleteError) {
            var self = this;
           var dataObj =  {
                            "delete-policy-templates": {
                                "policy-ids": {
                                    "policy-id": idArr
                                }
                            }
                        };

            $.ajax({
                type: 'POST',
                url: self.constants.IPS_POLICY_TEMPLATE_DELETE_URL,
                data: JSON.stringify(dataObj),
                headers: {
                    "Content-Type": self.constants.DELETE_CONTENT_HEADER
                },
                dataType: "json",
                success: onDeleteSuccess,
                error: onDeleteError
            });
        };       
    };

    IpsPolicytemplateActivity.prototype = Object.create(GridActivity.prototype);
    IpsPolicytemplateActivity.prototype.constructor = IpsPolicytemplateActivity;

    return IpsPolicytemplateActivity;
});