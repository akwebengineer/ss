/**
 * A module that works with zone sets.
 *
 * @module ZoneSetActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/zoneSetGridConfiguration.js',
    './conf/zoneSetDuplicatesGridConfiguration.js',
    './models/zoneSetModel.js',
    './models/duplicatedZoneSetsMergeModel.js',
    './models/zoneSetCollection.js',
    './views/zoneSetView.js',
    './views/zoneSetDetailView.js'
], function(GridActivity, GridConfiguration, DuplicatesGridConfiguration, Model, DuplicatedZoneSetsMergeModel, Collection, View, DetailView) {
    var ANY = 'Any',
        SYSTEM_DOMAIN = 'SYSTEM';

    /**
     * Constructs a ZoneSetActivity.
     */
    var ZoneSetActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: ["createZoneSet"]
            },
            "edit": {
                view: View,
                rbacCapabilities: ["modifyZoneSet"]
            },
            "clone": {
                view: View,
                rbacCapabilities: ["createZoneSet"]
            },
            "delete": {
                rbacCapabilities: ["deleteZoneSet"]
            },
            "showUnused": {},
            "findUsage": {},
            "showDuplicates": {
                gridconfiguration: DuplicatesGridConfiguration,
                mergeModel: DuplicatedZoneSetsMergeModel,
                mergeRbacCapabilities: ["createZoneSet", "modifyZoneSet", "deleteZoneSet"],
                deleteRbacCapabilities: ["deleteZoneSet"]
            },
            "deleteUnused": {
                rbacCapabilities: ["deleteZoneSet"]
            },
            "showDetailView": {
                view: DetailView
            },
            "clearAllSelections": {}
        };

        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection(); // Use collection to augment grid conf

        this.isDisabledClone = function(eventName, selectedRows) {
            // Check if it is single row selection
            if (selectedRows.length !=1 ) {
                return true;
            }

            // check whether default object named "Any" is included in selected items
            for (var i=0; i<selectedRows.length; i++) {
                if (ANY == selectedRows[i].name && SYSTEM_DOMAIN == selectedRows[i]['domain-name']) {
                    return true;
                }
            }

            return false;
        };
    };

    ZoneSetActivity.prototype = Object.create(GridActivity.prototype);
    ZoneSetActivity.prototype.constructor = ZoneSetActivity;

    return ZoneSetActivity;
});
