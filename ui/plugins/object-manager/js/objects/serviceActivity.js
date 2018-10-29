/**
 * A module that works with services.
 *
 * @module ServiceActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
        '../../../ui-common/js/gridActivity.js',
        './conf/serviceGridConfiguration.js',
        './conf/serviceDuplicatesGridConfiguration.js',
        './models/serviceModel.js',
        './models/duplicatedServicesMergeModel.js',
        './models/serviceCollection.js',
        '../objects/views/serviceView.js',
        '../objects/views/serviceSelectionView.js',
        './views/serviceReplaceView.js',
        './views/serviceDetailView.js'
], function(GridActivity, GridConfiguration, DuplicatesGridConfiguration, Model, DuplicatedServicesMergeModel, Collection, View, SelectionView, ReplaceView, DetailView) {
    var ANY = 'Any',
        PREDEFINED_TYPE = 'PREDEFINED';

    /**
     * Constructs an ServiceActivity.
     */
    var ServiceActivity = function() {
        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: ["createApplications"]
            },
            "edit": {
                view: View,
                rbacCapabilities: ["ModifyApplication"]
            },
            "clone": {
                view: View,
                rbacCapabilities: ["createApplications"]
            },
            "select": {
                view: SelectionView
            },
            "delete": {
                rbacCapabilities: ["DeleteApplication"]
            },
            "replace": {
                view: ReplaceView,
                rbacCapabilities: ["ReplaceApplications"]
            },
            "showUnused": {},
            "findUsage": {},
            "showDuplicates": {
                gridconfiguration: DuplicatesGridConfiguration,
                mergeModel: DuplicatedServicesMergeModel,
                mergeRbacCapabilities: ["createApplications", "ModifyApplication", "DeleteApplication"],
                deleteRbacCapabilities: ["DeleteApplication"]
            },
            "deleteUnused": {
                rbacCapabilities: ["DeleteApplication"]
            },
            "assignToDomain": {
                rbacCapabilities: ["AssignApplicationToDomainCap"]
            },
            "showDetailView": {
                view: DetailView
            },
            "clearAllSelections": {}
        };

        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection();

        this.isDisabledClone = function(eventName, selectedRows) {
            // Check if it is single row selection
            if (selectedRows.length !=1 ) {
                return true;
            }

            // check whether default object named "Any" is included in selected items
            for (var i=0; i<selectedRows.length; i++) {
                if (ANY == selectedRows[i].name && PREDEFINED_TYPE == selectedRows[i]['definition-type']) {
                    return true;
                }
            }

            return false;
        };
    };

    ServiceActivity.prototype = new GridActivity();

    return ServiceActivity;
});
