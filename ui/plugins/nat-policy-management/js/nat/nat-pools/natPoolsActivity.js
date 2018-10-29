/**
 * A module that works with nat-pools.
 *
 * @module NAT Pools Activity
 * @author Damodhar <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/gridActivity.js',
    './conf/natPoolsGridConfiguration.js',
    './models/natPoolsModel.js',
    './views/natPoolsView.js',
    './models/natPoolsCollection.js',
    './conf/natPoolsDuplicatesGridConfiguration.js',
    './models/duplicatedNATPoolsMergeModel.js',
    './views/natPoolsReplaceView.js',
    './views/natPoolsDetailedInfoView.js'
], function(GridActivity, GridConfiguration, Model, View, Collection, DuplicatesGridConfiguration,
    DuplicatedNATPoolsMergeModel, ReplaceView,NatPoolsDetailedInfoView) {
    /**
     * Constructs a NATPoolsActivity.
     */
    var NATPoolsActivity = function() {
        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: ["createNATPool"]
            },
            "edit": {
                view: View,
                rbacCapabilities: ["modifyNATPool"]
            },
            "clone":{
                view: View,
                rbacCapabilities: ["createNATPool"]
            },
            "findUsage": {},
            "showDuplicates": {
              gridconfiguration: DuplicatesGridConfiguration,
              mergeModel:DuplicatedNATPoolsMergeModel,
              mergeRbacCapabilities: ["createNATPool", "modifyNATPool", "deleteNATPool"],
              deleteRbacCapabilities: ["deleteNATPool"]
            },
            "delete": {
               rbacCapabilities: ["deleteNATPool"] 
            },
            "showUnused": {},
            "replace": {
                view: ReplaceView,
                rbacCapabilities: ["ReplaceNATPools"] 
            },
           "deleteUnused":{
                rbacCapabilities: ["deleteNATPool"]
           },
           "assignToDomain": {
            rbacCapabilities: ["AssignNatPoolToDomainCap"]
           },
           "showDetailView": {
                view: NatPoolsDetailedInfoView         
            }
        };
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection(); 

        this.bindEvents = function() {
            //Calling super.bindEvents;
            GridActivity.prototype.bindEvents.call(this);
        };
        
    };


    NATPoolsActivity.prototype = new GridActivity();    

    return NATPoolsActivity;
});

