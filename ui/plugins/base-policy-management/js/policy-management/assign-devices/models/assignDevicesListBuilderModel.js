/**
 * Model for listBuilder operation
 * @module AssignDevicesListBuilderModel
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    '../../../../../ui-common/js/models/baseListBuilderModel.js',
    '../../constants/basePolicyManagementConstants.js'
], function (BaseModel,PolicyManagementConstants) {
	var AssignDevicesListBuilderModel = BaseModel.extend({
        policyModel:undefined,
        policyUrl:undefined,
        availableUrl:PolicyManagementConstants.ASSIGN_DEVICES_AVAILABLE_DEVICES,
        selectedUrl:PolicyManagementConstants.ASSIGN_DEVICES_SELECTED_DEVICES,
        availableAccept:PolicyManagementConstants.ASSIGN_DEVICES_AVAILABLE_ACCEPT,
        selectAccept:PolicyManagementConstants.ASSIGN_DEVICES_SELECT_ACCEPT,
        selectContentType:PolicyManagementConstants.ASSIGN_DEVICES_SELECT_CONTENT_TYPE,
        deselectContentType:PolicyManagementConstants.ASSIGN_DEVICES_DESELECT_CONTENT_TYPE,
        // use for getting selectAll and unselectAll ids
        availableAllUrl:PolicyManagementConstants.ASSIGN_DEVICES_AVAILABLE_DEVICES_IDS,
        selectedAllUrl:PolicyManagementConstants.ASSIGN_DEVICES_SELECTED_DEVICES_IDS,
        availableAllAccept:PolicyManagementConstants.ASSIGN_DEVICES_AVAILABLE_ALL_ACCEPT,
        selectAllAccept:PolicyManagementConstants.ASSIGN_DEVICES_SELECT_ALL_ACCEPT,

        initialize : function(options) {
            this.policyModel = options.policyModel;
            this.policyUrl = options.policyUrl;
            BaseModel.prototype.initialize.call(this, {});
        },

        setUrl : function() {
            var policyId = (this.policyModel === null) ? 0 : this.policyModel.get("id");
            this.urlRoot = this.policyUrl+policyId+'/item-selector/'+ this.generateStoreId();
        },
    /**
     * initialize the store on backend
     * @param callback
     */
    initStore: function(callback) {
      var me = this;
      $.ajax({
        type: 'POST',
        url: me.urlRoot + "/init",
        dataType: "json",
        success: function() {
          callback();
        },
        error: function() {
          console.log("failed to initialize the policy store");
        }
      });

    }
    });
	return AssignDevicesListBuilderModel;
});