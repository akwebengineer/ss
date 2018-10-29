/**
 * Module that implements the VPN Endpoint Settings page view.
 * This view's model is a view-model and not a data-model for the backend.
 * Owner of this view must convert the data-model to view-model at the time
 * of instantiating this view and convert the view-model to data-model 
 * at the time of saving data/settings to the backend.
 *
 * @module VPNEndpointSettingsPageView
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    '../conf/vpnEndpointSettingsGridConf.js',
    'widgets/grid/gridWidget',
    '../models/deviceCollection.js',
    '../models/ipsecVpnCollection.js',
    '../models/ipsecVpnDevicesCollection.js',
    './externalInterfaceView.js',
    './tunnelZoneView.js',
    './protectedEndpointsView.js',
    './routingInstanceView.js',
    './certificateView.js',
    './ikeAddressView.js',
    './groupIkeSettingsView.js',
    './initiatorRecipientView.js',
    './routeSettingsView.js',
    'widgets/overlay/overlayWidget'
], function (
    Backbone,
    Syphon,
    VPNEndpointSettingsGridConf,
    GridWidget,
    DeviceCollection,
    IpsecVpnCollection,
    IpsecVpnDevicesCollection,
    ExternalInterfaceView,
    TunnelZoneView,
    ProtectedEndpointsView,
    RoutingInstanceView,
    CertificateView,
    IkeAddressView,
    GroupIkeSettingsView,
    InitiatorRecipientView,
    RouteSettingsView,
    OverlayWidget
) {
   var editRow;
   var urlDevicesHref;
   var tunnelZones = [];
   var externalInterfaces = [];

    var VpnEndpointSettingsPageView = Backbone.View.extend({

        /**
         * The constructor for this view using overlay.
         * 
         * @param {Object} options - The options containing the Slipstream's context
         */
        initialize: function(options) {
            this.context = options.context;
            this.collection = new DeviceCollection();
            this.ipsecVpnCollection = new IpsecVpnCollection();
            this.ipsecVpnDevicesCollection = new IpsecVpnDevicesCollection();
            this.uuid = options.uuid;
            this.actionEvents = {
                updateEvent: "editEvent"
            }
        },
        //editEvent: function() {
        //},
        bindGridEvents: function (){
            var self = this;
            this.$el
                .bind(this.actionEvents.updateEvent, function (e, gridRowsObject) {
                    // Edit the endpoint row
                    // console.log(gridRowsObject);
                    self.modifyEndpoints(gridRowsObject);
                })
                .bind("gridRowOnEditMode", function (e, editModeRow) {
                    self.handleRowDataEdit(editModeRow);
                });
/*
                .bind(this.actionEvents.statusEvent, function(e, updatedGridRow){
                    console.log("updatedGridRow");
                })
                .bind("gridRowOnEditMode", function(e, editModeRow){
                    console.log(editModeRow);
//                    urlDevicesHref = editModeRow.selectedRowData["@href"];
                }

                );
 */


        },

        createViews: function () {
            var self = this;

            var externalInterfaceView = new ExternalInterfaceView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'external-if-name',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false,
		'uuid' : self.uuid
            });

            var tunnelZoneView = new TunnelZoneView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'tunnel-zone',
                'context': self.context,
                'model': self.model,
                'fromGlobalSettingsPage': false,
                'uuid': self.uuid
            });

            var initiatorRecipientView = new InitiatorRecipientView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'is-hub-two',
                'context': self.context,
                'model' : self.model,
                'activity': self,
                'fromGlobalSettingsPage': false
            });

            var protectedView = new ProtectedEndpointsView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'protected-zoneinterface',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false,
		'uuid' : self.uuid
            });

            var routingInstanceView = new RoutingInstanceView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'tunnel-vr',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false
            });

            var routeSettingsView = new RouteSettingsView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'route-settings',
		        'fromModify': false,
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false
            });

            var groupIkeSettingsView = new GroupIkeSettingsView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'ike-group-id',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false
            });

            var certificateView = new CertificateView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'certificate',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false
            });

            var ikeAddressView = new IkeAddressView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'ike-address',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false
            });

            var cellViews = {
                'external-if-name': externalInterfaceView,
                'tunnel-zone': tunnelZoneView,
                'is-hub-two': initiatorRecipientView,
                'protected-zoneinterface': protectedView,
                'tunnel-vr': routingInstanceView,
                'route-settings': routeSettingsView,
                'ike-group-id': groupIkeSettingsView,
                'certificate': certificateView,
                'ike-address': ikeAddressView
            };

            return cellViews;
        },

        save:  function(columnName, data) {
            // External Interface, Tunnel Zone, Certificate come from Grid cells
            // Only save the protected resource (zones, interfaces, address) to model
            if ((data.dataType === "ZONES") || (data.dataType === "INTERFACES") || (data.dataType === "ADDRESS")) {
                // Every row that has been edited by the cell overlay is now saved in a hash table that is stored
                // in the space model.  All the selected Items that is part of the data from the cell overlay
                // is now saved in the model hashed by the rowId of the grid column that has been selected for edit.

                var map = this.model.get("protectedResourceDataTable");

                if (map) {
                    // Save each row's proteced resource cell data in the table
                    // so that it can be reloaded into the selected items list builder in the cell overlay
                    // Use the cell's rowId that is passed from the cell overlay to uniquely identify the data in the table.
                    map[data.rowId] = data;
                    this.model.set("protectedResourceDataTable", map);
                } else {
                  // Create hash map table and save protected resource cell data in table.
                  // Use the cell's rowId that is passed from the cell overlay  to uniquely identify the data in the table.
                  var map = {};
                  map[data.rowId] = data;
                  this.model.set("protectedResourceDataTable", map);
                };
            };
            if(data.dataType === "GROUPIKE")
                this.model.set("endpointSettingsGroupIke", data);
            if (data.dataType === "ROUTESETTINGS")
                this.model.set("endpointSettingsRouteSettings", data);

            this.$el.trigger('updateCellOverlayView',{
                'columnName':columnName,
                'cellData':data.cellData
            });
        },

        cellTooltip: function (cellData, renderTooltip){
            var errorMessage = cellData.rawData["error-message"];
            var message = "";

            if (errorMessage) {
                // highest severity
                if (errorMessage[0] && errorMessage[0].message) {
                    for (i = 0; i < errorMessage[0].message.length; i++) {
                        message = message + '<font color="red">' + errorMessage[0].message[i].key + '</font>' + "<br/>";
                    };
                };
                // medium severity
                if (errorMessage[1] && errorMessage[1].message) {
                    for (i = 0; i < errorMessage[1].message.length; i++) {
                        message = message + '<font color="orange">' + errorMessage[1].message[i].key + '</font>' + "<br/>";
                    };
                };
                // info
                if (errorMessage[2] && errorMessage[2].message) {
                    for (i = 0; i < errorMessage[2].message.length; i++) {
                        message = message + '<font color="white">' + errorMessage[2].message[i].key + '</font>' + "<br/>";
                    };
                };
            };

            renderTooltip(message);
        },

        close:  function(columnName,e) {
            e && e.preventDefault();
//            e.preventDefault();
//            e.stopPropagation();
//            e.stopImmediatePropagation();            
            this.$el.trigger('closeCellOverlayView', columnName);
        },

        /**
         * Creates the actual Grid based on configuration
         */
        createEndpointSettingsGridFromCache: function() {
            var self = this;
            var generalSettingsData = this.model.get("generalsettings");
            var vpnType = generalSettingsData["vpn-type"];
            var autoVPN = generalSettingsData["auto-vpn"];
            var isMultiProxy = generalSettingsData["multi-proxyid-enable"];
            var tunnelMode = generalSettingsData["tunnel-mode"];
            var profileMode = this.model.get("generalsettingsprofilemode");
            this.context.vpnType = vpnType;
            this.context.autoVPN = autoVPN;
            this.context.profileMode = profileMode;
            var gridConf = new VPNEndpointSettingsGridConf(this.context);
            self.gridConfValues = gridConf.getValues(self.uuid);
            if(tunnelMode ==="POLICY_BASED") {
                self.gridConfValues.columns.forEach(function(element){
                    if(element.name==="tunnel-zone" || element.name==="protected-zoneinterface" || element.name==="tunnel-vr") {
                        element["hidden"]=true;
                    }
                });
            }

            /* Protected zone column will be hidden if Routing Option is selected as NONE
            *  and MultiProxyId / Traffic Selector is not enabled in general settings page.
            *
            * Even though Routing Option is set to "NO_ROUTING", if MultiProxyId / Traffic Selector is enabled,
            * then Protected-Zone is visible /shown.
            */

            if(this.model.get("routingOptions").toUpperCase()==="NO_ROUTING" && !isMultiProxy) {
               self.gridConfValues.columns.forEach(function(element){
                  if(element.index==="protected-zoneinterface") {
                    element["hidden"]=true;
                 }
                });
            }

             // The route settings column is displayed if the routing options are set to protocols OSPF , RIP or STATIC [for hub]
            if ((this.model.get("routingOptions") === "OSPF" || this.model.get("routingOptions") === "RIP" ||
            (this.model.get("routingOptions") === "STATIC" && this.context.vpnType == "HUB_N_SPOKE")) && !isMultiProxy) {
                self.gridConfValues.columns.forEach(function(element){
                    if (element.index === "route-settings")
                        element["hidden"] = false;
                 });
            };

           //Enable/Disable Certificate column based on profile type
           var profileId = this.model.get("generalsettings")["profile-id"];
           this.context.profileId = profileId;
           $.ajax({
              url: '/api/juniper/sd/vpn-management/vpn-profiles/'+profileId,
              type: 'get',
              dataType: 'json',
              scope: self,
              headers: {
                        'accept': 'application/vnd.juniper.sd.vpn-management.vpn-profile+json;q=0.01;version=1'

                    },
                    success: function(data, status) {
                               var authMethod = data['vpn-profile']['phase1-setting']['auth-method'];
                               this.scope.updateGridColumns(authMethod,this.scope);
			       self.context.ikeIdentityType = data['vpn-profile']['phase1-setting']['ike-id'];
                               console.log();


                           },
                           error: function() {
                                this.scope.updateGridColumns(authMethod,this.scope);
                               console.log('certificates not fetched');
                           },
                           async: false
            })

        },

        updateGridColumns : function(authMethod,scope) {
            var generalSettings = scope.model.get("generalsettings");
            var isAutoVpn =  scope.context.autoVPN;
            var isAdVpn = generalSettings["advpn"];
            if(authMethod==="PRESHARED_KEY") {
                scope.gridConfValues.columns.forEach(function(element){
                                    if(element.name==="certificate") {
                                        element["hidden"]=true;
                                        return;
                                    }

                });
            }

            scope.gridConfValues.columns.forEach(function(element) {
                if(element.name === "is-hub-two") {
                    if((generalSettings["vpn-type"] == "SITE_TO_SITE" && scope.context.profileMode !=  "AGGRESSIVE") ||
                        generalSettings["vpn-type"] != "SITE_TO_SITE") {
                        element["hidden"] = true;
                        return;
                    }
                }
            });

            scope.gridConfValues.columns.forEach(function(element) {
                if(element.name === "ike-group-id") {
                    if(!(generalSettings["vpn-type"] === "HUB_N_SPOKE" &&
                        isAutoVpn && (isAutoVpn || isAdVpn))) {
                            element["hidden"] = true;
                            return;
                    }
                }
            });

            this.grid = new GridWidget({
                           container: this.el,
                           elements: scope.gridConfValues,
                           actionEvents: scope.actionEvents,
                           cellOverlayViews: scope.cellOverlayViews,
                           cellTooltip: scope.cellTooltip
           }).build();
            this.$el.find('.edit').hide(); //PR 1147530
            this.$el.find('.actionMenu .more').hide(); //PR 1147530
        },

        handleRowDataEdit : function(editRow) {
            var self = this;
            var keyValue = "";
            var isExtranetDevice = editRow.currentRowData["extranet-device"];
            if(isExtranetDevice) {
                keyValue = "external-if-name";
                self.removeEditor(editRow, keyValue);
                keyValue = "tunnel-zone";
                self.removeEditor(editRow, keyValue);
                keyValue = "tunnel-vr";
                self.removeEditor(editRow, keyValue);
                keyValue = "certificate";
                self.removeEditor(editRow, keyValue);
		        keyValue = "tunnel-vr";
                self.removeEditor(editRow, keyValue);
                if(this.model.get("routingOptions") === "OSPF" || this.model.get("routingOptions") === "RIP"){
                    keyValue = "protected-zoneinterface";
                    self.removeEditor(editRow, keyValue);
                }

            }
            if(editRow.currentRowData["is-hub"] === false) {
                keyValue = "ike-group-id";
                self.removeEditor(editRow, keyValue);
            }
          if(this.context.vpnType == "HUB_N_SPOKE"){
            if(editRow.currentRowData["is-hub"] === false && (this.context.autoVPN || this.context.profileMode ==  "AGGRESSIVE")) {
                keyValue = "ike-address";
                self.removeEditor(editRow, keyValue);
            }
          }

          if(this.context.vpnType == "SITE_TO_SITE" && editRow.currentRow["is-hub-two"][0] === "Initiator" && this.context.profileMode ==  "AGGRESSIVE") {
              keyValue = "ike-address";
              self.removeEditor(editRow, keyValue);
          }
          if(isExtranetDevice || (this.context.vpnType == "HUB_N_SPOKE" && editRow.currentRowData["is-hub"] === false && this.model.get("routingOptions") === "STATIC")){
                keyValue = "route-settings";
                self.removeEditor(editRow, keyValue);
          }
        },

        removeEditor : function(editRow, keyValue) {
            var editorCellData = editRow.currentRow[keyValue],
            editorCell = $(editRow.currentRowFields[keyValue]).closest('td');
            editorCell.empty();
            //workaround because editorCellData doesn't return the text
            if(typeof editorCellData != "string") {
                editorCellData = "<span class='nat-disabled'>" + this.context.getMessage("nat_rulegrid_not_applicable") + "</span>";
            }
            editorCell.append(editorCellData);
        },

        /**
         * Renders the form view.
         * 
         * returns this object
         */
        render: function() {
            this.$el.empty();
            this.bindGridEvents();
            this.cellOverlayViews = this.createViews();
            this.createEndpointSettingsGridFromCache();

            return this;
        },

        createVpnFromCache: function(uuid, options) {
            var requestBody = this.model.get("basicvpndetails");
            var jsonRequest = JSON.stringify(requestBody);
            var vpnName = requestBody["vpn-basic-details"]["vpn-mo"]["name"];
            var self = this;
            var results = false;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/create-vpn-from-cache?ui-session-id=' +uuid,
                type: 'post',
                dataType: 'json',
                data: jsonRequest,
                headers: {
                   'Content-Type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-basic-details+json;version=1;charset=UTF-8'
                },
                success: function(data, status) {
                   results = true;

                   // Replace the placeholder "{0}" with the vpn name
                   responseString = self.context.getMessage("vpn_wizard_create_success");
                   responseString = responseString.replace("{0}",vpnName);
                   // Invoke the success process of wizard
                   options.success(responseString);

                   console.log('createvpn 1' + results);
                },
      //          async: false,
                error: function(status) {
                    console.log('Unable to Create VPN from cache ');

                    // Replace the placeholder "{0}" with the vpn name
                    responseString = self.context.getMessage("vpn_wizard_create_failure");
                    responseString = responseString.replace("{0}",vpnName);
                    // Invoke the error process of wizard
                    options.error(status + ". " + responseString);

                    results = false;
                }
            });
 //            return results;
        },

        // Load the device endpoints from cache to ui
        getDeviceEndpointsCache: function() {
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/load-endpoint-details?ui-session-id='+this.uuid,
                type: 'get',
                dataType: 'json',
                headers: {
                   'Accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-device-endpoint-details+json;q=0.01;version=1'
                },
                success: function(data, status) {
                },
                async: false,
                error: function(status) {
                    console.log('Unable to get Endpoints device Data ');
                }
            });

        },

        // This routine returns the json request body for the updated endpoint
        getUpdateEndpointRequest: function(gridRowsObject) {
            var globalSettings = this.model.get("globalsettingsbuttons");
            var groupIke = this.model.get("endpointSettingsGroupIke");
            var groupIkeValue = (groupIke)?groupIke.apiData:"";
            var isHub = (gridRowsObject.updatedRow["is-hub"].toString() === "true") ? true : false;

            var ikeAddressVal = gridRowsObject.updatedRow["ike-address"][0];

            var device = {
                // need to fix certificate - on reload what if it is undefined
                "certificate": gridRowsObject.updatedRow["certificate"][0],
                //"device-id": gridRowsObject.updatedRow.id,
                "device-ip": "",
                "device-moid": gridRowsObject.updatedRow["device-moid"][0],
                "device-name": gridRowsObject.updatedRow["device-name"],
                "export-default-routes": globalSettings["default-routes"],
                "export-ospf-routes": globalSettings["ospf-routes"],
                "export-rip-routes": globalSettings["rip-routes"],
                "export-static-routes": globalSettings["static-routes"],
                "metric": gridRowsObject.updatedRow.metric[0],
                "external-if-name": gridRowsObject.updatedRow["external-if-name"][0],
                "extranet-device" : gridRowsObject.originalData["extranet-device"],
                "id": gridRowsObject.updatedRow.id,
                "ike-address": ikeAddressVal,
                "ike-group-id": (groupIkeValue != "" ? groupIkeValue : gridRowsObject.updatedRow["ike-group-id"][0]),
                "initiator": false,
                "is-hub": isHub,
                "metric": gridRowsObject.updatedRow.metric[0],
                "proxy-id": "",
                "tunnel-vr": gridRowsObject.updatedRow["tunnel-vr"][0],
                "tunnel-zone": gridRowsObject.updatedRow["tunnel-zone"][0],
            };

            // The hash table now saves every edited rows protected network data
            // Get the data to be written to the backend from the hash table
            // that is saved in the space model.  The row id indexes the hash table.

            var map = this.model.get("protectedResourceDataTable");
            var rowId = gridRowsObject.originalData.id;

            if (map) {
                var updateData = map[rowId];
                if (updateData) {

                    var vpnType = this.model.get("generalsettings")["vpn-type"];
                    var profileMode = "";

                    // update rest call requires the following fields to exist

                    if (updateData.dataType === "INTERFACES") {
                        device["protected-network-interfaces"] = {"protected-network-interface":updateData.apiData};
                    } else if (updateData.dataType === "ZONES") {
                        device["protected-network-zones"] = {"protected-network-zon":updateData.apiData};
                    } else if (updateData.dataType === "ADDRESS") {
                        device["protected-networks"] = {"protected-network":updateData.apiData};
                    }; // no default case because not possible to find row in hash table and not one of three types
                } else {
                    // row is not found in hash table so read from original row data
                    device["protected-network-interfaces"] = {"protected-network-interface":gridRowsObject.originalData["protected-network-interfaces"]["protected-network-interface"]};
                    device["protected-network-zones"] = {"protected-network-zon":gridRowsObject.originalData["protected-network-zones"]["protected-network-zone"]};

                    if (gridRowsObject.originalData["protected-networks"] && gridRowsObject.originalData["protected-networks"]["protected-network"]) {
                        // address data is an array of objects with name, id, domain-id
                        var listValues = [];
                        for(i=0; i < gridRowsObject.originalData["protected-networks"]["protected-network"].length; i++ ) {
                            listValues.push({
                                "name": gridRowsObject.originalData["protected-networks"]["protected-network"][i].name,
                                "id": gridRowsObject.originalData["protected-networks"]["protected-network"][i].id,
                                "domain-id": gridRowsObject.originalData["protected-networks"]["protected-network"][i]["domain-id"],
                            });
                        };
                        device["protected-networks"] = {"protected-network":listValues};
                    } else {
                        // Workaround backend if protected-networks was null object then make request with empty array.
                        // Do this anyway eventhough backend will treat missing protected-network parameter as a null input.
                        device["protected-networks"] = {"protected-network":[]};
                    };
               };
            } else {
                // If there is no hash table - user started an edit but cancelled the edit and leaves edit mode without
                // actually changing any cells data then retrieve data from grid row original data.
                // Additional case is where user modifed a cell other than protected networks.

                device["protected-network-interfaces"] = {"protected-network-interface":gridRowsObject.originalData["protected-network-interfaces"]["protected-network-interface"]};
                device["protected-network-zones"] = {"protected-network-zon":gridRowsObject.originalData["protected-network-zones"]["protected-network-zone"]};

                if (gridRowsObject.originalData["protected-networks"] && gridRowsObject.originalData["protected-networks"]["protected-network"]) {
                    // This code only sends the fields that are required by the backend for protected networks
                    // The original data had extra fields that the backend does not need so those are not sent to the backend anymore.
                    // address data is an array of objects with name, id, domain-id
                    var listValues = [];
                    for(i=0; i < gridRowsObject.originalData["protected-networks"]["protected-network"].length; i++ ) {
                        listValues.push({
                            "name": gridRowsObject.originalData["protected-networks"]["protected-network"][i].name,
                            "id": gridRowsObject.originalData["protected-networks"]["protected-network"][i].id,
                            "domain-id": gridRowsObject.originalData["protected-networks"]["protected-network"][i]["domain-id"],
                       });
                    };
                    device["protected-networks"] = {"protected-network":listValues};
                } else {
                    // Workaround backend if protected-networks was null object then make request with empty array.
                    // Do this anyway eventhough backend will treat missing protected-network parameter as a null input.
                    device["protected-networks"] = {"protected-network":[]};
                };
            };

            // Remove the prepended label from the device request body before making the backend REST call.
            // In the case of the grid cell configuration formatter having executed, the configuration formater prepends the
            // label "Zone: " or "Interfaces: " or "Address: " to the first entry in the protected list.
            // The configuration formatter will have executed if the Endpoints setting page entered from global settings zone/interface page
            // with global protected settings zone/interfaces values set or from endpoint settings grid user hit finish and then back page.
            // In the case of "Address: ", the cell configuration formatter does not affect the protected network address cell data
            // because the protected network address is a list of object ids. The formatter can only write strings so
            // only the protected zones and interfaces have this issue of the cell data being modified because they are lists of strings.

            if (device["protected-network-zones"] && device["protected-network-zones"]["protected-network-zon"]) {
                if (device["protected-network-zones"]["protected-network-zon"].length !== 0) {
                    device["protected-network-zones"]["protected-network-zon"][0] = device["protected-network-zones"]["protected-network-zon"][0].replace("Zones: ","");
                };
            };

            if (device["protected-network-interfaces"] && device["protected-network-interfaces"]["protected-network-interface"]) {
                if (device["protected-network-interfaces"]["protected-network-interface"].length !== 0) {
                    device["protected-network-interfaces"]["protected-network-interface"][0] = device["protected-network-interfaces"]["protected-network-interface"][0].replace("Interfaces: ","");
                };
            };

            if (device["external-if-name"] === undefined)
                device["external-if-name"] = "";
            if (device["tunnel-zone"] === undefined)
                device["tunnel-zone"] = "";

            // if vpn type is site-to-site and profile mode is aggressive, then overload the is-hub parameter with:
            // is-hub is false: initiator = true and recipient = false
            // is-hub is true:  initiator = false and recipient = true;`
            //
            // if vpn type is not site-to-site, then do not touch is-hub.
            var vpnTypes = this.model.get("generalsettings")["vpn-type"];
            if (vpnTypes === "SITE_TO_SITE") {
                profileMode = this.model.get("generalsettingsprofilemode");
                if (profileMode === "AGGRESSIVE") {
                    if (gridRowsObject.updatedRow["is-hub-two"][0] === "Initiator")
                        device["is-hub"] = false; // initiator = true and recipient = false;

                    if (gridRowsObject.updatedRow["is-hub-two"][0] === "Recipient")
                        device["is-hub"] = true;  // initiator = false and recipient = true;
                }
            };

            // On endpoint settings grid row, user can edit Route Settings that were previously set during
            // the tunnel route and global settings page. Only check route settings if user selected
            // route settings overlay
              var routeSettingsData = gridRowsObject.updatedRow['route-settings'];
               var exportVal = 'None';
               var metricVal = -1;
               if(routeSettingsData.length > 0) {
                   exportVal = routeSettingsData[0]; //.substr(deviceEndpoint.metric[0].indexOf('Export:')+8, deviceEndpoint.metric[0].length);
                   var metricTempVal = (routeSettingsData[1] != undefined ? routeSettingsData[1].substr(routeSettingsData[1].indexOf('Metric:')+8, routeSettingsData[1].length) : metricVal);
                   if(metricTempVal != "" && metricTempVal != -1){
                       metricVal = parseInt(metricTempVal);
                   }
               }
               device['metric'] = metricVal;
               device['export-static-routes'] = false;
               device['export-rip-routes'] = false;
               device['export-ospf-routes'] = false;
               device['export-default-routes'] = false;

               if(exportVal.indexOf("Static") > 0) {
                   device['export-static-routes'] = true;
               }
               if (exportVal.indexOf("OSPF") > 0) {
                   device['export-ospf-routes'] = true;
               }
               if (exportVal.indexOf("RIP") > 0) {
                   device['export-rip-routes'] = true;
               }
               if (exportVal.indexOf("Default") > 0) {
                   device['export-default-routes'] = true;
               }

            var deviceList = [device];

            var update =
                {
                    "update-endpoint": {
                        "vpn-end-point": {
                            "vpn-device-bean": deviceList
                        }
                    }
                };

            return update;
        },

        // Update the endpoints with grid values that have been edited by the user
        modifyEndpoints: function(gridRowsObject) {
            var self = this;
            var requestBody = this.getUpdateEndpointRequest(gridRowsObject);
            var jsonRequest = JSON.stringify(requestBody);
            var results = false;
            var errorLevel;
            var errorMessage;
            var ikeAddress;
            var isHub;

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/update-endpoints-in-cache?ui-session-id='+this.uuid,
                type: 'post',
                dataType: 'json',
                data: jsonRequest,
                headers: {
                   'Accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-device-endpoint-details+json;version=1;q=0.01',
                   'Content-Type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.update-endpoint+json;version=1;charset=UTF-8'
                },
                success: function(data, status) {

                    // When the update event is triggered, edit mode for row is false
                    // Save cell values from rest backend call that will update row with new values after row edit
                    errorLevel = data.devices.device[0]['error-level'];
                    errorMessage = data.devices.device[0]['error-message'];
                    ikeAddress = data.devices.device[0]['ike-address'];
                    isHub = data.devices.device[0]['is-hub'];

                    results = true;
                },
                async: false,
                error: function(status) {
                    console.log('Unable to update Endpoints device Data ');
                    results = false;
                }
            });

            // Because update endpoint rest call is synchronous, return here with saved values from backend rest call.
            // Add saved values to the current row.

            // Work around: tool tip data is rendered from the originalData not the updatedRow data.
            gridRowsObject.originalData['error-message'] = errorMessage;
            gridRowsObject.updatedRow['error-message'] = errorMessage;

            gridRowsObject.updatedRow['error-level'] = errorLevel;
            gridRowsObject.updatedRow['ike-address'] = ikeAddress;
            gridRowsObject.updatedRow['is-hub'] = isHub;

            // update the grid with the grid with the data from the backend
            // Note that grid configuration formatters are invoked by editRow method so icon and
            // other cells can be updated with new information from the previous rest call.
            // Note also that the editRow method converts the row object fields to strings.

            self.grid.editRow(gridRowsObject.updatedRow, gridRowsObject.updatedRow);

            return results;
        },

        /**
         * Return the page title for the wizard.
         * 
         * returns String, the page title
         */
        getTitle: function() {
            return this.context.getMessage('vpn_endpoint_settings_form_title');
        },

        /**
         * Returns the page summary for the wizard.
         * 
         * returns Array, containing input summary
         */
        getSummary: function() {
            var summary = [];
 //           var userData = Syphon.serialize(this);
            var vpnnameLabel = this.context.getMessage('vpn_wizard_endpoint_settings_page_title');
            var hubList = this.model.get("selectedHubDeviceIds");
            var endpointList = this.model.get("selectedEndpointDeviceIds");
            var hubCount = 0;
            var endpointCount = 0;

            summary.push({
                label: vpnnameLabel,
                value: ' '
            });

            if (typeof hubList === 'undefined') {
                hubCount = 0;
            } else {
                hubCount = hubList.length;
            };

            if (typeof endpointList === 'undefined') {
                endpointCount = 0;
            } else {
                endpointCount = endpointList.length;
            }

            // Total Number of selected hubs and selected endpoints
            summary.push({
                label: this.context.getMessage('vpn_wizard_total_devices'),
                value: (hubCount + endpointCount)
            });


            /* this code will auto-generate a summary only if the configuration id and name fields have identical values

            this.$el.find('form label').each( function(i, ele) {
                summary.push({
                   'label': vpnnameLabel,
                   'value': userData[ele.getAttribute('for')]
                });
            });
            */
            return summary;
        },

        /**
         * Handles back and next button clicks on the wizard.
         * 
         * returns Boolean, false if form validation fails else true to let wizard navigate pages
         */
        beforePageChange: function(frompage, topage) {
            //this.$el.empty();
            this.grid.removeEditModeOnRow();
            if (frompage > topage) {
                return true;
            };
            // Save the Grid because create vpn won't be performed until summary page okay.
            var endpointSettingsGrid = this.grid.getAllVisibleRows();
            this.model.set("endpointsettingsgrid", endpointSettingsGrid);

            
            return true;
        }
    });

    return VpnEndpointSettingsPageView;

}); 
