/**
 * A module that works with addresses.
 *
 * @module AddressActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/addressGridConfiguration.js',
    './conf/addressDuplicatesGridConfiguration.js',
    './models/addressModel.js',
    './models/duplicatedAddressesMergeModel.js',
    './models/addressCollection.js',
    './views/addressCreateView.js',
    './views/addressSelectionView.js',
    './views/addressImportView.js',
    './views/addressReplaceView.js',
    './views/addressExportView.js',
    './views/addressDetailView.js'
], function(GridActivity, GridConfiguration, DuplicatesGridConfiguration, Model, DuplicatedAddressesMergeModel, Collection, View, SelectionView, ImportView, ReplaceView, ExportView, DetailView) {
    var ANY = "Any Address",
        ANY_IPV4 = "Any IPv4 Address",
        ANY_IPV6 = "Any IPv6 Address";

    /**
     * Constructs a AddressActivity.
     */
    var AddressActivity = function() {
        GridActivity.call(this);
        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: ["createAddress"]
            },
            "edit": {
                view: View,
                rbacCapabilities: ["ModifyAddress"]
            },
            "select": {
                view: SelectionView
            },
            "clone": {
                view: View,
                rbacCapabilities: ["createAddress"]
            },
            "delete": {
                rbacCapabilities: ["DeleteAddresses"]
            },
            "import": {
                view: ImportView,
                rbacCapabilities: ["createAddress", "ModifyAddress"]
            },
            "replace": {
                view: ReplaceView,
                rbacCapabilities: ["ReplaceAddresses"]
            },
            "export": {
                view: ExportView
            },
            "showUnused": {},
            "findUsage": {},
            "showDuplicates": {
                gridconfiguration: DuplicatesGridConfiguration,
                mergeModel: DuplicatedAddressesMergeModel,
                mergeRbacCapabilities: ["createAddress", "ModifyAddress", "DeleteAddresses"],
                deleteRbacCapabilities: ["DeleteAddresses"]
            },
            "deleteUnused": {
                rbacCapabilities: ["DeleteAddresses"]
            },
            "assignToDomain": {
                rbacCapabilities: ["AssignAddressToDomainCap"]
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

            // check whether the object with "Any" type is included in selected items
            for (var i=0; i<selectedRows.length; i++) {
                if (ANY == selectedRows[i]['address-type'] ||
                    ANY_IPV4 == selectedRows[i]['address-type'] ||
                    ANY_IPV6 == selectedRows[i]['address-type']) {
                    return true;
                }
            }

            return false;
        };
    };

    AddressActivity.prototype = Object.create(GridActivity.prototype);
    AddressActivity.prototype.constructor = AddressActivity;

    return AddressActivity;
});
