/**
 * A module that works with port sets.
 *
 * @module PortSetsActivity
 * @author Sandhya <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/gridActivity.js',
    './conf/portSetsGridConfiguration.js',
    './models/portSetsModel.js',
    './models/portSetsCollection.js',
    './views/portSetsCreateView.js',
    './conf/portSetDuplicatesGridConfiguration.js',
    './models/duplicatedPortSetsMergeModel.js'
 ],  function(GridActivity, GridConfiguration, Model, Collection, View,DuplicatesGridConfiguration,DuplicatedPortSetsMergeModel) {
    /**
     * Constructs a PortSetsActivity.
     */
    var PortSetsActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: ["createPortSet"]
            },
            "edit": {
                view: View,
                rbacCapabilities: ["modifyPortSet"]
            },
            "clone": {
                view: View,
                rbacCapabilities: ["createPortSet"]
            },
            "delete": {
                rbacCapabilities: ["deletePortSet"]
            },
            "findUsage": {},
            "showDuplicates": {
              gridconfiguration: DuplicatesGridConfiguration,
              mergeModel:DuplicatedPortSetsMergeModel,
              mergeRbacCapabilities: ["createPortSet", "modifyPortSet", "deletePortSet"],
              deleteRbacCapabilities: ["deletePortSet"]
            },
            "showUnused": {},
            "deleteUnused":{
                rbacCapabilities: ["deletePortSet"]
            },
            "assignToDomain": {
                rbacCapabilities: ["AssignPortSetToDomainCap"]
            }

        };
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection();
    };

    PortSetsActivity.prototype = Object.create(GridActivity.prototype);
    PortSetsActivity.prototype.constructor = PortSetsActivity;

    return PortSetsActivity;
});