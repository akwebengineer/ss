/**
 * A module that works with User Firewall Active Directory.
 *
 * @module activeDirectoryActivity
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/
define([
    '../../../../ui-common/js/gridActivity.js',
    './conf/activeDirectoryGridConfiguration.js',
    './models/activeDirectoryModel.js',
    './views/activeDirectoryView.js',
    '../constants/userFirewallConstants.js',
    '../common/utils/userFwUtil.js',
    './models/activeDirectoryCollection.js'

], function (GridActivity, GridConfiguration, Model, View, Constants, UserFwUtil, Collection) {
    /**
     * Constructs a Active Directory Activity.
     */
    var ActiveDirectoryActivity = function () {
        GridActivity.call(this);
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection();

        // sets capabilities
        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: [Constants.ACTIVE_DIRECTORY.CAPABILITIES.CREATE]
            },
            "edit": {
                view: View,
                rbacCapabilities: [Constants.ACTIVE_DIRECTORY.CAPABILITIES.EDIT]
            },
            "clone": {
                view: View,
                rbacCapabilities: [Constants.ACTIVE_DIRECTORY.CAPABILITIES.CREATE]
            }
        };

     this.bindEvents= function() {
            GridActivity.prototype.bindEvents.call(this);
            this.bindDeployEvent();
            this.bindDeleteEvent();
        };

     this.bindDeployEvent= function() {

          this.events.deployEvent = {
            name: Constants.ACTIVE_DIRECTORY.DEPLOY_EVENT,
            capabilities: [Constants.ACTIVE_DIRECTORY.CAPABILITIES.DEPLOY]
          };
          this.view.$el.bind(this.events.deployEvent.name, $.proxy(this.onDeployActiveDirectoryEvent, this));

        };

        this.onDeployActiveDirectoryEvent= function() {
          var self = this,
              model = self.getNewModelInstance(),
              activeDirectoryId = this.view.gridWidget.getSelectedRows()[0].id;
          var intent = new Slipstream.SDK.Intent('slipstream.SDK.Intent.action.ACTION_DEPLOY',{
                mime_type: 'vnd.juniper.net.userfirewall.activedirectory.deploy'
           });

           intent.putExtras({objId: activeDirectoryId});

           this.context.startActivity(intent);

        };

        this.userFwUtils = new UserFwUtil();
        // start of delete related chagnes
        // these chagnes will be removed once framework provides delete dialog custimization
        /**
         * handle delete from secondary button
         */
        this.bindDeleteEvent= function() {
            this.events.deleteADEvent = {
                name: Constants.ACTIVE_DIRECTORY.DELETE,
                capabilities: [Constants.ACTIVE_DIRECTORY.CAPABILITIES.DELETE]
            };
            this.view.$el.bind(this.events.deleteADEvent.name, $.proxy(this.onDeleteActiveDirectoryEvent, this));

        };
        /**
         * trigger custom overlay showDeleteConfirmation
         */
        this.onDeleteActiveDirectoryEvent = function(){
            this.userFwUtils.showDeleteConfirmation("ACTIVE_DIRECTORY", this.context, $.proxy(this.onDeleteAD, this));
        };
        /**
         * get the selected records from grid and call onDelete of Grid Activity
         * @param deleteFromDevice
         */
        this.onDeleteAD = function(deleteFromDevice) {
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
            return new this.model().urlRoot + Constants.DELETE.URL + this.deleteFromDevice;
        };
        //end of delete related changes
        this.onDeleteSuccess = function(model){
            if(model.task && model.task.id > 0){
                this.userFwUtils.showJobInformation(model.task.id, this.context);
            }
            this.view.notify('success', this.getContext().getMessage("delete_success"));
        };

        this.getDeleteObjectAcceptType = function(){
            return Constants.DELETE.ACCEPT;
        };
        // Enable/disable the action buttons
       this.setButtonStatus = function (selectedRows, updateStatusSuccess, updateStatusError){
            selectedRows = selectedRows.selectedRows;

           var enableEdit = !this.isDisabledEditButton(selectedRows),
               enableDelete = !this.isDifferentDomain(selectedRows) && (selectedRows.length > 0 ? true : false),
               enableDeploy =  !this.isDifferentDomain(selectedRows) && (selectedRows.length === 1 ? true : false);

           updateStatusSuccess({
               "edit": enableEdit,
               "deleteADEvent": enableDelete,
               "deployEvent": enableDeploy
           });
        };

   // });
   }
    ActiveDirectoryActivity.prototype = Object.create(GridActivity.prototype);
    ActiveDirectoryActivity.prototype.constructor = ActiveDirectoryActivity;
    ActiveDirectoryActivity.prototype = new GridActivity();

    return ActiveDirectoryActivity;
});
