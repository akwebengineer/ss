/**
 * A module that works with variables.
 *
 * @module VariableActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/variableGridConfiguration.js',
    './models/variableModel.js',
    './models/variableCollection.js',
    '../objects/views/variableView.js',
    './views/variableImportView.js',
    './views/variableExportView.js',
    './views/variableDetailView.js'
], function(GridActivity, GridConfiguration, Model, Collection, View, ImportView, ExportView, DetailView) {
    /**
     * Constructs a variableActivity.
     */
    var VariableActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: ["createVariable"]
            },
            "edit": {
                view: View,
                rbacCapabilities: ["modifyVariable"]
            },
            "clone": {
                view: View,
                rbacCapabilities: ["createVariable"]
            },
            "delete": {
                rbacCapabilities: ["deleteVariable"]
            },
            "import": {
                view: ImportView,
                rbacCapabilities: ["createVariable", "modifyVariable"]
            },
            "export": {
                view: ExportView
            },
            "assignToDomain": {
                rbacCapabilities: ["AssignVariableToDomainCap"]
            },
            "showDetailView": {
                view: DetailView
            },
            "clearAllSelections": {}
        };
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection(); 
    };

    VariableActivity.prototype = Object.create(GridActivity.prototype);
    VariableActivity.prototype.constructor = VariableActivity;

    return VariableActivity;
});
