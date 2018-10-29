/**
 * A module that works with Alerts.
 *
 * @module AlertDefinitionActivity
 * @author Slipstream Developers <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    '../../ui-common/js/gridActivity.js',
    './conf/alertDefinitionGridConfiguration.js',
    './models/alertDefinitionModel.js',
     './models/alertDefinitionCollection.js',
    './views/alertDefinitionCreateView.js',    
], function(GridActivity, GridConfiguration, Model, Collection, View) {
    /**
     * Constructs an AlertDefinitionActivity.
     */
    var AlertDefinitionActivity = function() {
        GridActivity.call(this);
        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: ["createAlert"]
            },
            "edit": {
                view: View,
                rbacCapabilities: ["modifyAlert"]
            },
            "clone": {
                view: View,
                rbacCapabilities: ["createAlert"]
            },
            "delete": {
                rbacCapabilities: ["deleteAlert"]
            },
            "select": {}           
        };
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection();
    }

    AlertDefinitionActivity.prototype = Object.create(GridActivity.prototype);
    AlertDefinitionActivity.prototype.constructor = AlertDefinitionActivity;

    return AlertDefinitionActivity;
});