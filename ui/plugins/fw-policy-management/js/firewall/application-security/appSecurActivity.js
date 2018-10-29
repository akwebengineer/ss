/**
 * A module that works with ApplicationSecurityActivity.
 *
 * @module ApplicationSecurityActivity
 * @author vinayms@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 */
define([
        '../../../../ui-common/js/gridActivity.js',
        './conf/appSecurGridConf.js',
        './views/AppSecureFormView.js',
        './views/AppFwPolicyView.js',
        './model/AppSecureModel.js',
        './model/appSecureCollection.js'
    ],


    function (GridActivity, AppSecureGridConf, AppSecureFormView, AppFwPolicyView, AppSecureModel, Collection) {
        /**
         * Constructs a AppSecureActivity.
         */
        var ApplicationSecurityActivity = function () {
            var me = this;
            GridActivity.call(me);

            me.capabilities = {
                "list":{
                    view: AppFwPolicyView,
                    rbacCapabilities:['manageAppFWPolicy']
                },
                "create": {
                    view: AppSecureFormView,
                    size: 'medium',
                    rbacCapabilities:['createAppFWPolicy']
                },
                "clone": {
                    view: AppSecureFormView,
                    size: 'medium',
                    rbacCapabilities:['createAppFWPolicy']
                },
                "edit": {
                    view: AppSecureFormView,
                    size: 'medium',
                    rbacCapabilities:['modifyAppFwPolicy']
                },
                "delete": {
                    view: AppSecureFormView,
                    rbacCapabilities:['deleteAppFwPolicy']
                },
                "showUnused": {},
                "deleteUnused":{
                   rbacCapabilities:['deleteAppFwPolicy']
                },
                "findUsage": {
                    key: 'profile-name'
                }

            };
            me.model = AppSecureModel;
            me.gridConf = AppSecureGridConf;
            me.collection = new Collection();

            /**
             * Override default behavior of onDelete functionality
             * @param idArr
             * @param onDeleteSuccess
             * @param onDeleteError
             */
            me.onDelete = function (idArr, onDeleteSuccess, onDeleteError) {
                var self = this, model, dataObj;
                if (idArr.length === 0) {
                    return;
                }

                model = new self.model();

                $(idArr).each(function (index) {
                    idArr[index] = Number(idArr[index]);
                });
                dataObj = {
                    'id-list': {
                        'ids': idArr
                    }
                };

                $.ajax({
                    type: 'POST',
                    url: model.urlRoot + "/delete",
                    data: JSON.stringify(dataObj),

                    headers: {
                        "Content-Type": 'application/vnd.juniper.sd.bulk-delete+json;version=1;charset=UTF-8'
                    },
                    dataType: "json",
                    success: onDeleteSuccess,
                    error: onDeleteError
                });


            }
        };

        ApplicationSecurityActivity.prototype = Object.create(GridActivity.prototype);
        ApplicationSecurityActivity.prototype.constructor = ApplicationSecurityActivity;

        return ApplicationSecurityActivity;
    });
