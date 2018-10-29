/**
 * Module that implements the selected devices protected zone and interfaces view for global settings grid
 *
 * @module ProtectedView
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/listBuilder/listBuilderWidget',
    '../conf/protectedFormConf.js',
    '../widgets/zoneListBuilder.js',
    '../widgets/interfaceListBuilder.js'
], function (Backbone, Syphon, FormWidget, ListBuilderWidget, ProtectedFormConfiguration, ZoneListBuilder, InterfaceListBuilder) {

    var ProtectedView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
            this.uuid = options.uuid;
        },

        events: {
            'click #protected-zone-id': "selectProtectedZone",
            'click #protected-interface-id': "selectProtectedInterface",
            'click #btnOk': "saveProtected",
            'click #linkCancel': "closeProtected"
        },

        selectProtectedZone: function(event) {
            this.$el.find('#slipstream_list_builder_widget_vpn-protected-zone-list').show();
            this.$el.find('#slipstream_list_builder_widget_vpn-protected-interface-list').hide();
        },

        selectProtectedInterface: function(event) {
            this.$el.find('#slipstream_list_builder_widget_vpn-protected-zone-list').hide();
            this.$el.find('#slipstream_list_builder_widget_vpn-protected-interface-list').show();
        },

        getProtectedType: function(){
            var data = "";
            if (this.$el.find('#protected-interface-id').prop("checked")) {
                data = this.$el.find('#protected-interface-id').prop("value");
            };
            if (this.$el.find('#protected-zone-id').prop("checked")) {
                data = this.$el.find('#protected-zone-id').prop("value");
            };
            return data;
        },

        // Returns selected Device(s) id list 
        // @param {String} deviceList

        getDeviceIdList: function(deviceList) {
            // Get the selected devices
            var idList = [];
            deviceList.forEach(function(object) {
               idList.push(object.extraData);
            });

            return idList;
        },

        // Protected Interface list builder

        addListBuilderProtectedInterface: function(id, selectedDevices) {
            var self = this;
            var listContainer = this.$el.find('#' + id),
                conf = {
                    context: this.context,
                    container: listContainer,
                    selectedItems: [],
                    id: "vpn-protected-interface-list",
                    // global devices use ui-session-id
                    urlParameters: {"ui-session-id":  this.uuid }
                };

            listContainer.attr("readonly", "");
            if(this.model.get("generalsettings")["vpn-type"]==="HUB_N_SPOKE")
              if(this.passedRowData["originalRowData"]["type"]==="Hub")
                conf.urlParameters["is-hub"]=true;


            if (selectedDevices){
                conf.selectedItems = [].concat(selectedDevices);
            }

            this.interfaceListBuilder = new InterfaceListBuilder(conf);

            this.interfaceListBuilder.build(function() {
                listContainer.find('.new-list-builder-widget').unwrap();

                // Hide the protected interface list builder
                self.$el.find('#slipstream_list_builder_widget_vpn-protected-interface-list').hide();

                // After the second list builder is created, now push the radio button that matches
                // the data from the grid cell.  Default is zone radio button.

                self.protectedClick();
            });
        },

        // Protected Zone list builder

        addListBuilderProtectedZone: function(id, selectedDevices) {
            var self = this;
            var listContainer = this.$el.find('#' + id),
                conf = {
                    context: this.context,
                    container: listContainer,
                    selectedItems: [],
                    id: "vpn-protected-zone-list",
                    // global devices use ui-session-id
                    urlParameters: {"ui-session-id":  this.uuid }
                };

            listContainer.attr("readonly", "");
            if(this.model.get("generalsettings")["vpn-type"]==="HUB_N_SPOKE")
                if(this.passedRowData["originalRowData"]["type"]==="Hub")
                                conf.urlParameters["is-hub"]=true;

            if (selectedDevices){
                conf.selectedItems = [].concat(selectedDevices);
            };

            this.zoneListBuilder = new ZoneListBuilder(conf);

            // Two list builders are built one after another; however, the lists fill asynchronously
            // so instead of showing two "Loading..." messages, just show the loading status from
            // the last list builder built.  Hide the zone list builder's "Loading..." message
            // Only allow the interface list builder to be displayed.

            this.$el.find('#protected-zone-list-id').hide();
            this.$el.find('#protected-interface-list-id').hide();


            this.zoneListBuilder.build(function() {
                var cellData =  self.passedRowData.cellData,
                    listBuilderId2 = "protected-interface-list-id",
                    protectedInterfaceSelectedDevices = null,
                    nameList = [];

                listContainer.find('.new-list-builder-widget').unwrap();

                // Hide the zone list builder
                self.$el.find('#slipstream_list_builder_widget_vpn-protected-zone-list').hide();

                // At the successful start of the zone list builder build, start the creation of the
                // interface list builder.

                // The grid cell is shared among two list builders.

                if ((cellData[0] === "") || (cellData[0] === "Click to configure") || (self.protectedCellType() !== "INTERFACES")) {
                    // If the cell is blank or contained data from the other list builders,
                    // then render the list builder with an empty selected list

                    protectedInterfaceSelectedDevices = null;
                } else {
                   // Take data from cell and place in selected items side of list builder.

                    cellData.forEach (function(object) {
                        nameList.push({name: object});
                    });
                    protectedInterfaceSelectedDevices = nameList;
                };

                // Create the protected interface list builder
                self.addListBuilderProtectedInterface(listBuilderId2, protectedInterfaceSelectedDevices);
            });
        },


        // This handles the list builders for  protected zone, and interface

        getProtectedListBuilders: function(e){
            var self = this;

            // List Builder call back function for get selected Interface list

            var getSelectedInterfaceCallback = function(response){
                var responseData = response['device-interfaces']['interface'];
                var nameList = [];

                responseData.forEach(function(object) {
                    nameList.push(object.name);
                });

                var data = {
                    "cellData": nameList,
                    "apiData": responseData,
                    "dataType": self.getProtectedType()
                };

                self.options.save(self.options.columnName, data);

                self.closeProtected(e);
            };


            // List Builder call back function for get selected Zone list

            var getSelectedZoneCallback = function(response){
                var responseData = response['device-zones']['zone'];
                var nameList = [];

                responseData.forEach(function(object) {
                    nameList.push(object.name);
                });

                var data = {
                    "cellData": nameList,
                    "apiData": responseData,
                    "dataType": self.getProtectedType()
                };

                self.options.save(self.options.columnName, data);

                self.closeProtected(e);
            };

           if (this.$el.find('#protected-zone-id').prop("checked")) {
                //data = this.listBuilderZone.getSelectedItems();
                this.zoneListBuilder.getSelectedItems(getSelectedZoneCallback);

            };

            if (this.$el.find('#protected-interface-id').prop("checked")) {
               //data = this.listBuilderInterface.getSelectedItems();
               this.interfaceListBuilder.getSelectedItems(getSelectedInterfaceCallback);
            };
        },

        getProtectedType: function(){
            var data = "";
            if (this.$el.find('#protected-interface-id').prop("checked")) {
                data = this.$el.find('#protected-interface-id').prop("value");
            };
            if (this.$el.find('#protected-zone-id').prop("checked")) {
                data = this.$el.find('#protected-zone-id').prop("value");
            };
            if (this.$el.find('#protected-address-id').prop("checked")) {
                data = this.$el.find('#protected-address-id').prop("value");
            };
            return data;
        },


        // Returns type of protected zone/interface cell only on first time row enters edit mode
        //
        // The protected zone/interface columns in the grid  will have values filled in by
        // the load endpoints REST call. The grid passes the row that was clicked on by the user to
        // this overlay. By looking at the field values for zone, interface and address columns,
        // we can determine which protected resource was selected.
        // Returns: "ZONES" or "INTERFACES"
        // By default returns "ZONES"
        // Because the global settings grid is not reloaded from the backend, information to restore
        // the grid is from the space model.  Use the rows Type field ("Hub" or "Spoke") to determine
        // whether or not the lastDataType is from the saved Hub or saved Endpoint (endpoint is the same
        // as spoke).
        protectedCellType: function () {
            // Default type is from endpoint
            var lastDataType = this.model.get("endpointSettingsProtectedResource");

            // If user clicked on Hub row then data comes from Hub space model
            if (this.passedRowData.originalRowData.type === "Hub")
                lastDataType = this.model.get("endpointSettingsProtectedResourceHub");

            if (lastDataType) {
              return lastDataType.dataType;
            } else {
              return "ZONES";
            }
        },

        // Clicks on one of the protected network radio buttons based on type of data that
        // was originally in the cell.

        protectedClick: function () {
            var cellType = this.protectedCellType();

            if (cellType === 'ZONES') {
                // if original cell data was from Protected Zone, render list builder by clicking on protected zone
                // radio button that will generate an event to the selectProtectedZone handler.
                this.$el.find('#protected-zone-id').click();
            } else if (cellType === 'INTERFACES') {
                // if original cell data was from Protected Interface, render list builder by clicking on protected interface
                // radio button that will generate an event to the selectProtectedInterface handler.
                this.$el.find('#protected-interface-id').click();
            } else if (cellType === 'ADDRESS') {
                // if original cell data was from Protected Address, render list builder by clicking on protected address
                // radio button that will generate an event to the selectProtectedAddress handler.
                this.$el.find('#protected-address-id').click();
            };
            // The overlay configuration automatically defaults the radio button to zone so no additional click code
            // needed here.
        },


        render: function(){
            var self = this;
            var selectedDevicesIdList;
            var protectedZoneRequest;
            var protectedInterfaceRequest;


            var formConfiguration = new ProtectedFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {}
            });
            this.formWidget.build();

            // Create three list builders one after another.  List builders are
            // asynchronous. The list builders build() method is equivalent to the ajax
            // success control point.  At the list builder's build() method, start the
            // creation of the next list builder.  All three list builders will be
            // loading their available and selected list in parallel.
            // Normally, there would be three "Loading..." messages that the user can
            // see but this looks odd since only one list builder will be visible at any time.
            // We will hide two of the "Loading..." messages.  Only the
            // the last list builder to be created loading message will be visible.
            // The order of creation is List builder Zone, interface, and then address.

            // Start the creation of the list builder with the protected Zone

            var cellData =  this.passedRowData.cellData,
                listBuilderId1 = "protected-zone-list-id",
                protectedZoneSelectedDevices = null,
                nameList = [];

            // Protected Zone list builder
            // The grid cell is shared among three list builders
            if ((cellData[0] === "") || (cellData[0] === "Click to configure") || (this.protectedCellType() !== "ZONES")) {
                // If the cell is blank or contained data from the other list builders,
                // then render the list builder with an empty selected list

                protectedZoneSelectedDevices = null;
            } else {

                // Take data from cell and place in selected items side of list builder.

                cellData.forEach (function(object) {
                    nameList.push({name: object});
                });
                protectedZoneSelectedDevices = nameList;
            };

            this.addListBuilderProtectedZone(listBuilderId1, protectedZoneSelectedDevices);

            return this;
        },

        getViewData : function(){
            if (this.form && this.form.isValidInput()) {
                var results = Syphon.serialize(this);
                data = this.convertViewToData(results);
                console.log(" data");
                console.log(data);
                return data;
            }
        },

        // Lets the user selected grid row information be used in the view

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData;

            // pass the selected row of data to view
            this.passedRowData = rowData;
        },

        getSelectedInterfaces: function() {
            var data = this.formWidget.getValues();
            return data[0].value;
        },

        getSelectedZones: function() {
            var data = this.formWidget.getValues();
            return data[0].value;
        },

        saveProtected: function (e){
            this.getProtectedListBuilders(e);

        },

        closeProtected: function (e){
            this.options.close(this.options.columnName, e);
        }

    });

    return ProtectedView;
});
