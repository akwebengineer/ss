/**
 * A module that works with Access Profile Activity.
 *
 * @module AccessProfileActivity
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/
define([
    '../../../../ui-common/js/gridActivity.js',
    './conf/accessProfileGridConfiguration.js',
    './views/accessProfileWizardView.js',
    './models/accessProfileModel.js',
    '../constants/userFirewallConstants.js',
    './models/accessProfileCollection.js',
    '../common/utils/userFwUtil.js'
], function(GridActivity, GridConfiguration,View, Model, UserFirewallConstants, Collection, UserFwUtil) {
    /**
     * Constructs a AccessProfileActivity.
     */
    var AccessProfileActivity = function() {
        GridActivity.call(this);
        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: [UserFirewallConstants.ACCESS_PROFILE.CAPABILITIES.CREATE]
            },
            "edit": {
                view: View,
                rbacCapabilities: [UserFirewallConstants.ACCESS_PROFILE.CAPABILITIES.EDIT]
            },

            "clone": {
                view: View,
                rbacCapabilities: [UserFirewallConstants.ACCESS_PROFILE.CAPABILITIES.CREATE]
            }
        };
        this.model = Model;
        this.collection = new Collection();
        this.gridConf = GridConfiguration;

        this.bindEvents= function() {
            GridActivity.prototype.bindEvents.call(this);
            this.bindDeployEvent();
            this.bindDeleteEvent();
        };

       this.bindDeployEvent= function() {
          this.events.deployEvent = {
            name: UserFirewallConstants.ACTIVE_DIRECTORY.DEPLOY_EVENT,
            capabilities: [UserFirewallConstants.ACCESS_PROFILE.CAPABILITIES.DEPLOY]
          };
          this.view.$el.bind(this.events.deployEvent.name, $.proxy(this.onDeployActiveDirectoryEvent, this));

        };

        this.onDeployActiveDirectoryEvent= function() {
          var self = this,
              model = self.getNewModelInstance(),
              activeDirectoryId = this.view.gridWidget.getSelectedRows()[0].id;
          var intent = new Slipstream.SDK.Intent('slipstream.SDK.Intent.action.ACTION_DEPLOY',{
                mime_type: 'vnd.juniper.net.userfirewall.accessprofile.deploy'
           });

           intent.putExtras({objId: activeDirectoryId});

           this.context.startActivity(intent);

        };

        this.userFwUtils= new UserFwUtil();
        // start of delete related chagnes
        // these chagnes will be removed once framework provides delete dialog custimization
        /**
         * handle delete from secondary button
         */
        this.bindDeleteEvent= function() {
            this.events.deleteAPEvent = {
                name: UserFirewallConstants.ACCESS_PROFILE.DELETE,
                capabilities: [UserFirewallConstants.ACCESS_PROFILE.CAPABILITIES.DELETE]
            };
            this.view.$el.bind(this.events.deleteAPEvent.name, $.proxy(this.onDeleteAccessProfileEvent, this));

        };
        /**
         * trigger custom overlay showDeleteConfirmation
         */
        this.onDeleteAccessProfileEvent = function(){
            this.userFwUtils.showDeleteConfirmation("ACCESS_PROFILE", this.context, $.proxy(this.onDeleteAP, this));
        };
        /**
         * get the selected records from grid and call onDelete of Grid Activity
         * @param deleteFromDevice
         */
        this.onDeleteAP = function(deleteFromDevice) {
            this.deleteFromDevice = deleteFromDevice;
            var self= this,
                selectedRecords = this.view.gridWidget.getSelectedRows(true),
                extras = {
                    onDeleteSuccess: ($.proxy(self.onDeleteSuccess,self)),
                    onDeleteError: function(XMLHttpRequest, textStatus, errorThrown) {
                        self.onDeleteError(XMLHttpRequest, textStatus, errorThrown,selectedRecords.selectedRowIds, selectedRecords.selectedRows);
                    }
                };
            self.onDelete(selectedRecords.selectedRowIds, extras.onDeleteSuccess, extras.onDeleteError);
        };
        /**
         * update the Delete URL with delelet form device or not flag
         * @returns {*}
         */
        this.getDeleteObjectsUrl = function() {
            return new this.model().urlRoot + UserFirewallConstants.DELETE.URL + this.deleteFromDevice;
        };

        //end of delete related changes

        this.onDeleteSuccess = function(model){
            if(model.task && model.task.id > 0){
                this.userFwUtils.showJobInformation(model.task.id, this.context);
            }
            this.view.notify('success', this.getContext().getMessage("delete_success"));
        };

        this.getDeleteObjectAcceptType = function(){
            return UserFirewallConstants.DELETE.ACCEPT;
        };

        // Enable/disable the action buttons
        this.setButtonStatus = function (selectedRows, updateStatusSuccess, updateStatusError){
            selectedRows = selectedRows.selectedRows;

            var enableEdit = !this.isDisabledEditButton(selectedRows),
                enableDelete = !this.isDifferentDomain(selectedRows) && (selectedRows.length > 0 ? true : false),
                enableDeploy =  !this.isDifferentDomain(selectedRows) && (selectedRows.length === 1 ? true : false);

            updateStatusSuccess({
                "edit": enableEdit,
                "deleteAPEvent": enableDelete,
                "deployEvent": enableDeploy
            });
        };
    }

    AccessProfileActivity.prototype = new GridActivity();
    AccessProfileActivity.prototype.constructor = AccessProfileActivity;

    return AccessProfileActivity;
});