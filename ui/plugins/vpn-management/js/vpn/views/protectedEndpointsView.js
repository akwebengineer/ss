/**
 * Module that implements the selected devices protected zone, interfaces, and address view.
 *
 * @module ProtectedEndpointsView
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/listBuilder/listBuilderWidget',
    '../conf/protectedFormConf.js',
    '../conf/protectedEndpointsFormConf.js',
    '../widgets/zoneListBuilder.js',
    '../widgets/interfaceListBuilder.js',
    '../../../../object-manager/js/objects/widgets/addressListBuilder.js'
], function (Backbone, Syphon, FormWidget, ListBuilderWidget, ProtectedFormConfiguration, ProtectedEndpointsFormConfiguration,
   ZoneListBuilder, InterfaceListBuilder, AddressListBuilder) {

    var ProtectedEndpointsView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
            this.uuid = options.uuid;
        },

        events: {
            'click #protected-zone-id': "selectProtectedZone",
            'click #protected-interface-id': "selectProtectedInterface",
            'click #protected-address-id': "selectProtectedAddress",
            'click #btnOk': "saveProtected",
            'click #linkCancel': "closeProtected",
            'click #add-new-button1': 'addNewAddress'
        },

        // This routine only shows the protected zone list builder

        selectProtectedZone: function(event) {
            this.$el.find('#slipstream_list_builder_widget_vpn-protected-zone-list').show();
            this.$el.find('#slipstream_list_builder_widget_vpn-protected-interface-list').hide();
            this.$el.find('#slipstream_list_builder_widget_vpn-protected-address-list').hide();
            this.$el.find('#add-new-button1').hide();
        },

        // This routine only shows the protected interface list builder

        selectProtectedInterface: function(event) {
            this.$el.find('#slipstream_list_builder_widget_vpn-protected-zone-list').hide();
            this.$el.find('#slipstream_list_builder_widget_vpn-protected-interface-list').show();
            this.$el.find('#slipstream_list_builder_widget_vpn-protected-address-list').hide();
            this.$el.find('#add-new-button1').hide();
        },

        // This routine only shows the protected address list builder

        selectProtectedAddress: function(event) {
            this.$el.find('#slipstream_list_builder_widget_vpn-protected-zone-list').hide();
            this.$el.find('#slipstream_list_builder_widget_vpn-protected-interface-list').hide();
            this.$el.find('#slipstream_list_builder_widget_vpn-protected-address-list').show();
            this.$el.find('#add-new-button1').show();
        },

        // Protected address list builder
        // This routine renders the address list builder.

        addListBuilderProtectedAddress: function(id, selectedDevices) {
            var self = this;
            var IPADDRESS = 'IPADDRESS',
                DNS = 'DNS',
                RANGE = 'RANGE',
                NETWORK = 'NETWORK',
                WILDCARD = 'WILDCARD',
                GROUP = 'GROUP',
                POLYMORPHIC = 'POLYMORPHIC',
                DYNAMIC_ADDRESS_GROUP = 'DYNAMIC_ADDRESS_GROUP',
                ANY = 'ANY',
                ANY_IPV4 = 'ANY_IPV4',
                ANY_IPV6 = 'ANY_IPV6',
                ALL_IPV6 = 'ALL_IPV6';

            var listContainer = this.$el.find('#' + id),
                conf = {
                        context: this.context,
                        container: listContainer,
                        selectedItems: [],
                        id: "vpn-protected-address-list",
                        excludedTypes: [ANY, ANY_IPV4, ANY_IPV6, ALL_IPV6, WILDCARD, DYNAMIC_ADDRESS_GROUP]
                };

            listContainer.attr("readonly", "");

            if (selectedDevices){
                conf.selectedItems = [].concat(selectedDevices);
            };

            this.addressListBuilder = new AddressListBuilder(conf);

            this.addressListBuilder.build(function() {
                listContainer.find('.new-list-builder-widget').unwrap();

                // Hide the protected address list builder
                self.$el.find('#slipstream_list_builder_widget_vpn-protected-address-list').hide();

                // After the third list builder is created, now push the radio button that matches
                // the data from the grid cell.  Default is zone radio button.

                self.protectedClick();
            });
        },


        // Protected Interface list builder
        // This routine will create the protected interface list builder and start the creation of the
        // the address list builder

        addListBuilderProtectedInterface: function(id, selectedDevices) {
            var self = this;
            var listContainer = this.$el.find('#' + id),
                conf = {
                    context: self.context,
                    container: listContainer,
                    selectedItems: [],
                    id: "vpn-protected-interface-list"
                };

            listContainer.attr("readonly", "");

            if (selectedDevices){
                conf.selectedItems = [].concat(selectedDevices);
            };

            this.interfaceListBuilder = new InterfaceListBuilder(conf);

            this.interfaceListBuilder.build(function() {
                var cellData =  self.passedRowData.cellData,
                    listBuilderId3 = "protected-address-list-id",
                    protectedAddressSelectedDevices = null,
                    idList = [],
                    lastDataSaved = [];

                listContainer.find('.new-list-builder-widget').unwrap();
                // Hide the interface list builder
                self.$el.find('#slipstream_list_builder_widget_vpn-protected-interface-list').hide();

                // If dynamic routing selected then do not build address list builder
                // only static routing has protected zone, interface, and address in the endpoint settings grid

                var routingOptions = self.model.attributes.globalsettingsproperties["routing-options"];
                if (routingOptions === "OSPF" || routingOptions === "RIP" ) {
                    // If dynamic routing, click on selected protected type radio button and skip building address list builder

                    self.protectedClick();
                    return;
                }

                // Start creation of the protected address list builder

                // The grid cell is shared among three list builders
                if ((cellData[0] === "") || (self.protectedCellType() !== "ADDRESS")) {
                    // If the cell is blank or contained data from the other list builders,
                    // then render the list builder with an empty selected list

                    protectedAddressSelectedDevices = null;
                } else {
                    // Take data from cell and place in selected items side of list builder.
                    // Address list builder selected side requires data to be in the form
                    // {id-list: {ids: ["id1","id2",...,"idn"]}}.  Can not take address from grid cellData.
                    // Grid uses cellData to render display as text.  cellData can not be used to store
                    // address ids so retrieve ids from space model.  See the save protected routine for how
                    // grid cell data is saved in the space model.

                    // Use the current row id from the original row data to index the
                    // protected resource hash table and retrieve previously saved selected items for the
                    // address list builder.

                    // The selected Items were saved in a hash table when overlay was closed.
                    // Get hash table from space model and find rowId that is key to hash table

                    var rowId = self.passedRowData.originalRowData.id;
                    var map = self.model.get("protectedResourceDataTable");

                    // The hash table contains all the selected Items when the cell was written.

                    if (map) {
                        lastDataSaved = map[rowId];

                        // build array of ids from ids saved in the hashtable
                        if (lastDataSaved) {
                            lastDataSaved.apiData.forEach (function(object) {
                                idList.push(object.id);
                            });
                        } else {
                            // if address is not in hash table
                            // Note there is never a case where this cell has been prefilled in with a protected address from
                            // the global settings page.  There is no option in the global settings page to change address.
                            // The cell is either blank or comes from the map that was created when a user edited the cell.
                            idList = null;
                        };
                    } else {
                        // Note there is never a case where this cell has been prefilled in with a protected address from
                        // the global settings page.  There is no option in the global settings page to change address.
                        // The cell is either blank or comes from the map that was created when a user edited the cell.
                        idList = null;
                    };

                    // Fill the selected items list from the items that were saved in the hash table as ids.

                    // Pass array of ids to selected list builder.
                    protectedAddressSelectedDevices = idList;
                };

                // Create the protected address list builder
                self.addListBuilderProtectedAddress(listBuilderId3, protectedAddressSelectedDevices);
            });
        },

        // Protected Zone list builder
        // This routine will create the protected zone list builder and start the creation of the
        // the interface list builder

        addListBuilderProtectedZone: function(id, selectedDevices) {
            var self = this;
            var listContainer = this.$el.find('#' + id),
                conf = {
                    context: self.context,
                    container: listContainer,
                    selectedItems: [],
                    id: "vpn-protected-zone-list",
                    // device-id of the grid row clicked on
                    urlParameters: {"device-id":this.passedRowData.originalRowData.id, "ui-session-id":  this.uuid}
                };

            listContainer.attr("readonly", "");

            if (selectedDevices){
                conf.selectedItems = [].concat(selectedDevices);
            }

            this.zoneListBuilder = new ZoneListBuilder(conf);

            // Three list builders are built one after another; however, the lists fill asynchronously
            // so instead of showing three "Loading..." messages, just show the loading status from
            // the last list builder built.
            //
            // For static routes,  hide the zone and interface list builder's "Loading..." messages. The user should
            // see the address list builder loading message.
            // In this case, only allow the address list builder to be displayed.
            //
            // For dynamic routes,  hide the zone list builder's "Loading..." message.  The user should see
            // see the interface list builder loading message.
            // In this case, only allow the interface list builder to be displayed.

            // Hide the zone list builder "Loading ..." message
            this.$el.find('#protected-zone-list-id').hide();

            var routingOptions = this.model.attributes.globalsettingsproperties["routing-options"];
            if ((routingOptions === "OSPF") || (routingOptions === "RIP")) {
                // dynamic routing show the interface list builder as loading ...
                // so don't hide the interface list builder.
            } else {
                // static routing show the address list builder as loading ... by hiding zone and interface list builders
                // Hide the interface list builder "Loading ..." message
                this.$el.find('#protected-interface-list-id').hide();
            };

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

                // The grid cell is shared among three list builders.

                if ((cellData[0] === "") || (self.protectedCellType() !== "INTERFACES")) {
                    // If the cell is blank or contained data from the other list builders,
                    // then render the list builder with an empty selected list

                    protectedInterfaceSelectedDevices = null;
                } else {
                    // The selected Items were saved in a hash table when overlay was closed.
                    // Get hash table from space model and find rowId that is key to hash table

                    var rowId = self.passedRowData.originalRowData.id;
                    var map = self.model.get("protectedResourceDataTable");

                    // The hash table contains all the selected Items when the cell was written.

                    if (map) {
                        lastDataSaved = map[rowId];

                        // Fill the selected items list from the items that were saved in the hash table
                        if (lastDataSaved) {
                            lastDataSaved.apiData.forEach (function(object) {
                                nameList.push({name: object});
                            });
                        } else {
                            // If interface was not in hash table
                            // Take the data from what was originally in the row.  Note that the grid config cell formatter may have run
                            // and added the "Interfaces: " to the first item in the originalRowData object.
                            //  Note also that the passedRowData cellData also contains the fully formatted string for the cell.
                            // Strip off the "Interfaces: " string from the first item before adding to the selected items list.

                            var origData = self.passedRowData.originalRowData["protected-network-interfaces"]["protected-network-interface"];
                            var temp = origData[0];
                            origData[0] =  temp.replace("Interfaces: ","");

                            origData.forEach(function(object) {
                                nameList.push({name: object});
                            });
                        };
                    } else {
                        // Take the data from what was originally in the row.  Note that the grid config cell formatter may have run
                        // and added the "Interfaces: " to the first item in the originalRowData object.
                        //  Note also that the passedRowData cellData also contains the fully formatted string for the cell.
                        // Strip off the "Interfaces: " string from the first item before adding to the selected items list.

                        var origData = self.passedRowData.originalRowData["protected-network-interfaces"]["protected-network-interface"];
                        var temp = origData[0];
                        origData[0] =  temp.replace("Interfaces: ","");

                        origData.forEach(function(object) {
                            nameList.push({name: object});
                        });
                    };

                    protectedInterfaceSelectedDevices = nameList;
                };

                // Create the protected interface list builder
                self.addListBuilderProtectedInterface(listBuilderId2, protectedInterfaceSelectedDevices);
            });
        },

        // This handles the list builders for  protected zone, interface, and network (address)

        getProtectedListBuilders: function(e){
            var self = this;
            var listValues = [];
            var data = [];

            // List Builder call back function for get selected Address list

            var getSelectedAddressCallback = function(response){
                var responseData = response['addresses']['address'];
                var nameList = [];
                var listValues = [];

                // protected networks (address) request body is array of objects
                // Add in the protected type at the top of the cell data list
                // Send only the addresses to the apidata used in the grid rest call

                if (responseData.length === 0) {
                   nameList = "";
                } else {
                    responseData.forEach(function(object) {
                        nameList.push(object.name);
                        listValues.push({
                            "name": object.name,
                            "id": object.id,
                            "domain-id": object["domain-id"]
                        });
                    });
                    nameList[0] = "Address: " + nameList[0];
                };

                var data = {
                    "cellData": nameList,
                    "apiData": listValues,
                    "dataType": self.getProtectedType(),
                    "rowId": self.passedRowData.originalRowData.id
                };

                // Data is sent back from overlay to grid cell
                self.options.save(self.options.columnName, data);

                self.closeProtected(e);
            };

            // List Builder call back function for get selected Interface list

            var getSelectedInterfaceCallback = function(response){
                var responseData = response['device-interfaces']['interface'];
                var nameList = [];
                var listValues = [];

                // Add in the protected type at the top of the cell data list
                // Send only the interfaces to the apidata used in the grid rest call

                if (responseData.length === 0) {
                   nameList = "";
                } else {
                    responseData.forEach(function(object) {
                        nameList.push(object.name);
                        listValues.push(object.name);
                    });

                    nameList[0] = "Interfaces: " + nameList[0];
                };

                var data = {
                    "cellData": nameList,
                    "apiData": listValues,
                    "dataType": self.getProtectedType(),
                    "rowId": self.passedRowData.originalRowData.id
                };

                // Data is sent back from overlay to grid cell
                self.options.save(self.options.columnName, data);

                self.closeProtected(e);
            };


            // List Builder call back function for get selected Zone list

            var getSelectedZoneCallback = function(response){
                var responseData = response['device-zones']['zone'];
                var nameList = [];
                var listValues = [];

                // Add in the protected type at the top of the cell data list
                // Send only the zones to the apidata used in the grid rest call

                if (responseData.length === 0) {
                   nameList = "";
                } else {
                    responseData.forEach(function(object) {
                        nameList.push(object.name);
                        listValues.push(object.name);
                    });

                    nameList[0] = "Zones: " + nameList[0];
                };

                var data = {
                    "cellData": nameList,
                    "apiData": listValues,
                    "dataType": self.getProtectedType(),
                    "rowId": self.passedRowData.originalRowData.id
                };

                // Data is sent back from overlay to grid cell
                self.options.save(self.options.columnName, data);

                self.closeProtected(e);
            };

            // Get the data in the callback routine

            if (this.$el.find('#protected-zone-id').prop("checked")) {
                //data = this.listBuilderZone.getSelectedItems();
                this.zoneListBuilder.getSelectedItems(getSelectedZoneCallback);

            };

            if (this.$el.find('#protected-interface-id').prop("checked")) {
               //data = this.listBuilderInterface.getSelectedItems();
               this.interfaceListBuilder.getSelectedItems(getSelectedInterfaceCallback);
            };

            // If dynamic routing options don't get selected items from protected address list builder because
            // dynamic routing does not support protected address.

            var routingOptions = self.model.attributes.globalsettingsproperties["routing-options"];
            if (routingOptions === "OSPF" || routingOptions === "RIP" ) {
                return;
            };

            if (this.$el.find('#protected-address-id').prop("checked")) {
                //data = this.listBuilderAddress.getSelectedItems();
                this.addressListBuilder.getSelectedItems(getSelectedAddressCallback);
            }
        },

        // This routine returns which radio button was checked (zone, interface, or address)
        // Returns
        // @param {String} data

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

        // Returns selected Device(s) id list 
        // @param {String} deviceList

        getDeviceIdList: function (deviceList) {
            // Get the selected devices
            var idList = [];
            deviceList.forEach(function(object) {
               idList.push(object.extraData);
            });

            return idList;
        },


        // Returns type of protected zone/interface/address cell only on first time row enters edit mode
        //
        // The protected zone/interface/address columns in the grid  will have values filled in by
        // the load endpoints REST call. The grid passes the row that was clicked on by the user to
        // this overlay.  A hash table for the protected network column is now saved in the space model
        // that saves every row that is edited by the user.
        // The type (ZONES, INTERFACES, ADDRESS) of the cell is saved in the space model.
        // The row id is used to index the hash table to retrieve the data that was saved in the model.
        // we can determine which protected resource was selected by returning the dataType that
        // was saved in the model.
        // Returns: "ZONES" or "INTERFACES" or "ADDRESS"
        // By default returns "ZONES"

        protectedCellType: function () {
            // Index the hash table with the rows id

            var cellData =  this.passedRowData.cellData;
            var rowId = this.passedRowData.originalRowData.id;

            // Access the hash table

            var map = this.model.get("protectedResourceDataTable");

            // If the cell is blank then default type to ZONES to match default configuration protected type radio button.

            if (cellData[0] === "") {
                return "ZONES";
            };

            // If we have saved some protected resource to model then get from model otherwise read from original data.
            if (map) {
                // Access the data type for the row that was saved in the space model.
                lastDataSaved = map[rowId];

                if (lastDataSaved) {
                    return lastDataSaved.dataType;
                };
            };

            // If the grid cell was already filled in from the global settings protected network page then read from
            // original data because the hash table will not have any entries for the grid.  We add to the hash table
            // after a row has been edited so that we can save the edits outside of the grid.
            // If there was no hash table entry for the row, then read from the original row data to
            // determine the type.
            // The backend rest call that loaded the original grid, for protected network should only return
            // with one of three fields having values.  The other values should be empty [] array.
            // The protected network that has a non-zero length will be the type of the protected network.

            if (this.passedRowData.originalRowData["protected-network-zones"]["protected-network-zone"].length !== 0) {
                return "ZONES";
            };

            if (this.passedRowData.originalRowData["protected-network-interfaces"]["protected-network-interface"].length !== 0) {
                return "INTERFACES";
            };

            // Additional check in case backend response of null for protected-networks
            if (this.passedRowData.originalRowData["protected-networks"] && this.passedRowData.originalRowData["protected-networks"]["protected-network"]) {
                if (this.passedRowData.originalRowData["protected-networks"]["protected-network"].length !== 0) {
                    return "ADDRESS";
                };
            };

            // If all else fails then default to ZONES.
            return "ZONES";
        },


        // Clicks on one of the protected network radio buttons based on type of data that
        // was originally in the cell.

        protectedClick: function () {
            if(this.passedRowData.originalRowData["extranet-device"])
            var cellType = 'ADDRESS';
            else
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
            var formConfiguration;

            var routingOptions = this.model.attributes.globalsettingsproperties["routing-options"];

            // Reason alternate configuration is used is that there is no ability to hide
            // a radio button in the form.  Dynamic routing options should not show
            // protected address radio button in the protected network cell overlays.

            if (routingOptions === "OSPF" || routingOptions === "RIP" ) {
                     formConfiguration = new ProtectedFormConfiguration(this.context);
            } else {
                     formConfiguration = new ProtectedEndpointsFormConfiguration(this.context);
            }

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {}
            });
            this.formWidget.build();

            // Get the selected devices from Global Settings Page or from Endpoint Settings Page.
            if (this.options.fromGlobalSettingsPage) {
                // A list of selected devices comes from the Global Settings page view
                selectedDevicesIdList = self.getDeviceIdList(this.model.get("selectedEndpointDeviceIds"));
            } else if(this.options.fromModify) {
                var id = (this.passedRowData.originalRowData["device-moid"].split(":"))[1];
                var selectedIdObj = [{extraData:id}];
                selectedDevicesIdList = self.getDeviceIdList(selectedIdObj);
            } else {
                // only a single id comes from the Endpoint Settings page view
                var selectedIdObj = [{extraData:this.passedRowData.originalRowData.id}];
                selectedDevicesIdList = self.getDeviceIdList(selectedIdObj);
            };

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
            if ((cellData[0] === "") || (this.protectedCellType() !== "ZONES")) {
                // If the cell is blank or contained data from the other list builders,
                // then render the list builder with an empty selected list

                protectedZoneSelectedDevices = null;
            } else {
                // The selected Items were saved in a hash table when overlay was closed.
                // Get hash table from space model and find rowId that is key to hash table

                var rowId = self.passedRowData.originalRowData.id;
                var map = self.model.get("protectedResourceDataTable");

                // The hash table contains all the selected Items when the cell was written.

                if (map) {
                    lastDataSaved = map[rowId];

                    // Fill the selected items list from the items that were saved in the hash table
                    if (lastDataSaved) {
                        lastDataSaved.apiData.forEach (function(object) {
                            nameList.push({name: object});
                        });
                    } else {
                        // if data was not in the hash table:
                        // Take the data from what was originally in the row.  Note that the grid config cell formatter may have run
                        // and added the "Zones: " to the first item in the originalRowData object.
                        //  Note also that the passedRowData cellData also contains the fully formatted string for the cell.
                        // Strip off the "Zones: " string from the first item before adding to the selected items list.
                        var origData = self.passedRowData.originalRowData["protected-network-zones"]["protected-network-zone"];
                        var temp = origData[0];
                        origData[0] =  temp.replace("Zones: ","");

                        origData.forEach(function(object) {
                            nameList.push({name: object});
                        });
                    };
                } else {
                    // Take the data from what was originally in the row.  Note that the grid config cell formatter may have run
                    // and added the "Zones: " to the first item in the originalRowData object.
                    //  Note also that the passedRowData cellData also contains the fully formatted string for the cell.
                    // Strip off the "Zones: " string from the first item before adding to the selected items list.

                    var origData = self.passedRowData.originalRowData["protected-network-zones"]["protected-network-zone"];
                    var temp = origData[0];
                    origData[0] =  temp.replace("Zones: ","");

                    origData.forEach(function(object) {
                        nameList.push({name: object});
                    });
                };

                protectedZoneSelectedDevices = nameList;
            };

            this.addListBuilderProtectedZone(listBuilderId1, protectedZoneSelectedDevices);
            if(this.passedRowData.originalRowData["extranet-device"]){
                this.$el.find('#protected-zone-id').attr("disabled",true);
                this.$el.find('#protected-interface-id').attr("disabled",true);
            }
            return this;
        },

        addNewAddress: function(e) {

           var self = this;
            // Access address view
            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, {
                "mime_type": "vnd.juniper.net.addresses"
            });
            intent.putExtras({addressTypes: ['host','network','range']});
            this.context.startActivityForResult(intent, function(resultCode, data) {

                // Add the newly created object in list of selected items.
                self.addressListBuilder.refresh(function() {
                    self.addressListBuilder.selectItems([data]);
                });

            });

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


        saveProtected: function (e){
            this.getProtectedListBuilders(e);
        },


        closeProtected: function (e){
            e && e.preventDefault();
            this.options.close(this.options.columnName, e);
        }
    });

    return ProtectedEndpointsView;
});
