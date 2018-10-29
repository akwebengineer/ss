/**
 * A module that works with sslForwardProxyProfiles.
 *
 * @module SslForwardProxyProfileActivity
 * @author nadeem@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/gridActivity.js',
    './conf/sslForwardProxyProfileGridConfiguration.js',
    './models/sslForwardProxyProfileModel.js',
    './models/sslForwardProxyProfileCollection.js',
    './views/sslForwardProxyProfileFormView.js',
    '../../../../ui-common/js/common/intentActions.js',
], function(GridActivity, GridConfiguration, Model, Collection, View, IntentActions) {
    /**
     * Constructs a SslForwardProxyProfileActivity.
     */
    var SslForwardProxyProfileActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities:['createSSLForwardProxyProfile']
            },
            "edit": {
                view: View,
                rbacCapabilities:['modifySSLForwardProxyProfile']
            },
            "delete": {
              rbacCapabilities:['deleteSSLForwardProxyProfile']
            },
            "clone": {
                view: View,
                rbacCapabilities:['createSSLForwardProxyProfile']
            },
            "showUnused": {},
            "findUsage": {},
            "deleteUnused":{
              rbacCapabilities:['deleteSSLForwardProxyProfile']
            },
            "showDetailView":{
               view : View,
            }
        };
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection();
        this.bindEvents = function() {
        GridActivity.prototype.bindEvents.call(this);
        };
        /**
         * @override from grid activity
         * [onDeleteEvent description]
         * @param  {object} e           [description]
         * @param  {object} selectedObj [seelcted row object]
         */
        this.onDeleteEvent = function(e, selectedObj) {
            var self = this;
            var selectedRows = selectedObj.deletedRows;

            var intent = self.createNewIntent(this.getIntent(), IntentActions.ACTION_DELETE);
            intent.putExtras({
                selectedRows: selectedRows,
                onDeleteSuccess: function (data) {
                    self.view.notify('success', self.getContext().getMessage("delete_success"));
                },
                onDeleteError: function (res) {
                    self.view.notify('error', self.getContext().getMessage("delete_error") +'</br>'+res.responseText);
                    self.view.gridWidget.reloadGrid();
                }
            });
            this.getContext().startActivity(intent);
        };
    }

    SslForwardProxyProfileActivity.prototype = Object.create(GridActivity.prototype);
    SslForwardProxyProfileActivity.prototype.constructor = SslForwardProxyProfileActivity;

    return SslForwardProxyProfileActivity;
});
