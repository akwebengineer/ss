/**
 * Module that implements the Modify VPN Endpoint Settings page view.
 *
 * @module ModifyVpnDeviceEndpointsSettingsView
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/grid/gridWidget',
    '../models/deviceCollection.js',
    '../models/ipsecVpnCollection.js',
    '../conf/ipsecVpnDevicesGridWizardConf.js',
    '../models/ipsecVpnDevicesCollection.js',
    './externalInterfaceView.js',
    './tunnelZoneView.js',
    './modifyProtectedEndpointsView.js',
    './routingInstanceView.js',
    './routeSettingsView.js',
    './certificateSettingsView.js',
    './proxySettingsView.js',
    './ikeAddressSettingsView.js',
    './groupIkeSettingsView.js',
    './initiatorRecipientView.js',
    'widgets/overlay/overlayWidget',
    './modifyVpnTunnelEndpointsView.js'
], function (
    Backbone,
    Syphon,
    GridWidget,
    DeviceCollection,
    IpsecVpnCollection,
    IpsecVpnDevicesGridWizardConfig,
    IpsecVpnDevicesCollection,
    ExternalInterfaceView,
    TunnelZoneView,
    ProtectedEndpointsView,
    RoutingInstanceView,
    RouteSettingsView,
    CertificateSettingsView,
    ProxySettingsView,
    IkeAddressSettingsView,
    GroupIkeSettingsView,
    InitiatorRecipientView,
    OverlayWidget,
    modifyVpnTunnelEndpointsView
) {

    var ModifyVpnDeviceEndpointsSettingsView = Backbone.View.extend({

        /**
         * The constructor for this view using overlay.
         *
         * @param {Object} options - The options containing the Slipstream's context
         */
        initialize: function(options) {
            this.context = options.context;
            this.activity = options.activity;
            this.collection = new DeviceCollection();
            this.UUID = this.options.UUID;
            this.ipsecVpnCollection = new IpsecVpnCollection();
            this.ipsecVpnDevicesCollection = new IpsecVpnDevicesCollection();
            this.context.vpnTypeCon = "";
            this.context.routingType = "";
            this.context.routingOptions = "";
            this.actionEvents = {
                updateEvent: "editEvent",
                saveEvent: "saveEvent",
                viewTunnelEvent: "viewTunnelEvent"
            }
        },

        events: {
            'click #ok': 'submit',
            'click #cancel': 'cancel'
        },

        onEditEvent: function(e, row) {
            var self = this;
            this.cacheDeviceEndpoints(row);
        },

        viewTunnelEvent: function(e, row) {
            var self = this;
            this.viewTunnelEndpoints(row, this.options.selectedRow);
        },

        viewTunnelEndpoints: function(deviceSelectedRow, vpnSelectedRow) {
            if(deviceSelectedRow.selectedRows[0] != undefined) {
                var self = this;
                var moid = deviceSelectedRow.selectedRows[0]["device-moid"];
                this.context.selRow = deviceSelectedRow.selectedRows[0]["is-hub_2"];
                var options = {
                    activity: self,
                    context: self.context,
                    selectedDeviceMOID: moid,
                    updatedVPNDetails: self.options.returnedData,
                    isCertBasedProfile : self.isCertBasedProfile,
                    isAggressiveProfile : self.isAggressiveProfile,
                    UUID            : this.UUID,
                    vpnSelectedRow: vpnSelectedRow
                };

                this.vpnTunnelEndPointsView = new modifyVpnTunnelEndpointsView(options);

                self.overlay = new OverlayWidget({
                    view: this.vpnTunnelEndPointsView,
                    type: "wide",
                    title : "",
                    okButton: true,
                    cancelButton: true,
                    showScrollbar: true
                });
                self.overlay.build();

                if(!self.overlay.getOverlayContainer().hasClass(self.context["ctx_name"])){
                      self.overlay.getOverlayContainer().addClass(self.context["ctx_name"]);
                }

                self.overlay.getOverlay().$el.find('#ok').on('click', function(event){
                   self.vpnTunnelEndPointsView.grid.removeEditModeOnRow();
                   event.preventDefault();
                   self.saveTunnel();
              });

            }
        },

        saveTunnel: function() {

                            var saveStatus = false;
                            $.ajax({
                                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/save-tunnels?ui-session-id=' + this.UUID + '&overwrite-changes=true',
                                type: 'get',
                                headers: {
                                    'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpn.save-tunnels-response+json;version=1;q=0.01'

                                },
                                success: function(data, status) {
                                    saveStatus = true;
                                },
                                async: false,
                                error: function(status) {
                                    console.log('Unable to clear cache');
                                }
                            });

                            return saveStatus;
                        },


        bindGridEvents: function (){
            var self = this;
            this.$el.bind(this.actionEvents.updateEvent, $.proxy(this.onEditEvent, this));
            this.$el.bind(this.actionEvents.saveEvent, $.proxy(this.saveVpn, this));
            this.$el.bind(this.actionEvents.viewTunnelEvent, $.proxy(this.viewTunnelEvent, this));
            this.$el.bind("gridRowOnEditMode", function (e, editModeRow) {
                self.handleRowDataEdit(editModeRow);
            });

        },

        handleRowDataEdit : function(editRow, context) {
            var self = this;
            var keyValue = "";
            var isExtranet = editRow.currentRowData["extranet-device"];
            if(isExtranet) {
                keyValue = "external-if-name";
                self.removeEditor(editRow, keyValue);
                keyValue = "tunnel-zone";
                self.removeEditor(editRow, keyValue);
                keyValue = "tunnel-vr";
                self.removeEditor(editRow, keyValue);
                keyValue = "certificate";
                self.removeEditor(editRow, keyValue);
		if(self.context.routingOptions == "OSPF" || self.context.routingOptions == "RIP"){
                   keyValue = "protected-zoneinterface";
                   self.removeEditor(editRow, keyValue);
                }
            }
            if(editRow.currentRowData["is-hub"] === false) {
                keyValue = "ike-group-id";
                self.removeEditor(editRow, keyValue);
            }
            this.context.hub_or_spoke =editRow.currentRow["is-hub_2"][0];
            if(this.vpnType == "HUB_N_SPOKE"){
                if(editRow.currentRowData["is-hub"] === false && (self.options.returnedData["auto-vpn"] || self.profileMode === "AGGRESSIVE")) {
                    keyValue = "ike-address";
                    self.removeEditor(editRow, keyValue);
                }
            }

            if(this.vpnType == "SITE_TO_SITE" && editRow.currentRow["is-hub"][0] === "Initiator" && self.profileMode ==  "AGGRESSIVE") {
                  keyValue = "ike-address";
                  self.removeEditor(editRow, keyValue);
            }

            if((this.vpnType == "HUB_N_SPOKE" && editRow.currentRowData["is-hub"] === false && self.context.routingOptions == "STATIC") || isExtranet){
                  keyValue = "metric";
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
            this.tunnelMode = this.options.returnedData["vpn-tunnel-mode-types"];
            this.context.routingType = this.options.returnedData["routing-type"];
            this.context.routingOptions = this.options.returnedData.routingOptions;
            this.profileMode = this.options.returnedData["modifygeneralsettingsprofilemode"];
            this.context.vpnTypeCon = this.options.returnedData["type"];
            this.context.is_hub = this.options.returnedData.selectedHubDeviceIds
            this.vpnType = this.options.returnedData["type"];
            this.getVpnProfileData();
            this.createEndpointSettingsGrid();
            return this;
        },

        getVpnProfileData: function() {
            var self = this;
            var profileId = self.options.returnedData["profile"].id;
            this.context.profileId = profileId;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-profiles/'+profileId,
                type: 'get',
                dataType: 'json',
                headers: {
                   'accept': 'application/vnd.juniper.sd.vpn-management.vpn-profile+json;q=0.01;version=1'
                },
                success: function(data, status) {
                    self.vpnProfileData = data;
                    var authMethod = data['vpn-profile']['phase1-setting']['auth-method'];
                    self.context.ikeIdentityType = data['vpn-profile']['phase1-setting']['ike-id'];
                    self.isCertBasedProfile = false;
                    if(authMethod === "RSA_SIGNATURE" || authMethod === "DSA_SIGNATURE"
                        || authMethod === "EC_DSA_SIGNATURE_256" || authMethod === "EC_DSA_SIGNATURE_384") {
                        self.isCertBasedProfile = true;
                    }
                    self.isAggressiveProfile = false;
                    if(data['vpn-profile']['phase1-setting']['mode']==="AGGRESSIVE"){
                        self.isAggressiveProfile = true;
                    }
                },
                error: function() {
                    console.log('vpn profile data not fetched');
                },
                async: false
            });
        },

        createEndpointSettingsGrid : function(){
            var self = this;

            var gridConf = new IpsecVpnDevicesGridWizardConfig(this.options.returnedData, this.context, this.options.selectedRow, this.UUID);
            var gridValues = gridConf.getValues();
            this.setGridColumns(gridValues.columns);
            this.cellOverlayViews = this.createViews();

            //If profile type is not cerrificate then hide certificate column
            if(!this.isCertBasedProfile) {
                 gridValues.columns.forEach(function(element){
                     if(element.name==="certificate") {
                        element["hidden"]=true;
                     }
                 });
            }

            gridValues.columns.forEach(function(element) {
                if(element.name === "is-hub") {
                    if((self.options.returnedData["type"] == "SITE_TO_SITE" && self.profileMode != "AGGRESSIVE") ||
                        self.options.returnedData["type"] != "SITE_TO_SITE") {
                        element["hidden"] = true;
                        return;
                    }
                }
                if(element.name === "metric") {
                   if(self.context.routingOptions == "OSPF" || self.context.routingOptions == "RIP" ||
                    (self.options.returnedData["type"] == "HUB_N_SPOKE" && self.context.routingOptions == "STATIC" && !self.options.returnedData["multi-proxyid"])){
                     element["hidden"] = false;
                   }else{
                     element["hidden"] = true;
                   }
                }
            });

            /* Protected zone column will be hidden if Routing Option is selected as NONE
            *  and MultiProxyId / Traffic Selector is not enabled in general settings page.
            *
            * Even though Routing Option is set to "NO_ROUTING", if MultiProxyId / Traffic Selector is enabled,
            * then Protected-Zone is visible /shown.
            */
            if(self.options.returnedData["vpn-tunnel-mode-types"]==="ROUTE_BASED") {
              if(self.context.routingOptions.toUpperCase() === "NO_ROUTING" && !self.options.returnedData["multi-proxyid"]) {
                 gridValues.columns.forEach(function(element){
                 if(element.index==="protected-zoneinterface") {
                    element["hidden"]=true;
                 }
              });
             }
           }

           this.grid = new GridWidget({
               container: this.el,
               elements: gridValues,
               actionEvents: self.actionEvents,
               cellOverlayViews: self.cellOverlayViews,
               cellTooltip: self.cellTooltip
            }).build();
             this.$el.find('.edit').hide(); // PR 1147530
             this.$el.find('.actionMenu .more').hide(); //PR 1147530

        },

        setGridColumns: function(gridElements) {
            var self = this;
            var isMultiProxyId = self.options.returnedData["multi-proxyid"];
            switch(this.vpnType) {
                case "SITE_TO_SITE":
                    var routingType = "";
                    var isRouting,
                        isProtectedResource,
                        isAggresiveModeProfile = new Boolean(false);

                    routingType = self.context.routingOptions;

                    if(routingType === "OSPF" || routingType === "RIP") {
                        isRouting = true;
                    }
                    if(isRouting || routingType === "STATIC") {
                        isProtectedResource = true;
                    }
                    isAggresiveModeProfile = (self.profileMode === "AGGRESSIVE" ? true : false);

                    if(this.tunnelMode === "ROUTE_BASED") {

                        gridElements.forEach(function (object) {
                            var index = object.index;
                            if(index === "ike-group-id") { //index === "metric" ||
                                object.hidden = true;
                            }
                            if(index === "certificate" && !self.isCertBasedProfile) {
                                object.hidden = true;
                            }
                            if(index === "proxy-id" && isMultiProxyId) {
                                object.hidden = true;
                            }
                            if(index === "metric" && !isRouting) {
                                object.hidden = true;
                            }
                            if(index === "is-hub" && !isAggresiveModeProfile) {
                                object.hidden = true;
                            }

                            /* Protected zone column will be hidden if Routing Option is selected as NONE
                            *  and MultiProxyId / Traffic Selector is not enabled in general settings page.
                            *  Here isProtectedResource is nothing but Routing Option value.
                            */

                            if(index === "protected-zoneinterface" && !isProtectedResource && !isMultiProxyId) {
                                object.hidden = true;
                            }
                        });
                    } else {
                        /* Tunnel mode is Policy Based, then this loop is triggered*/
                        gridElements.forEach(function (object) {
                            var index = object.index;

                            if(index === "tunnel-zone" ||index === "protected-zoneinterface" ||
                                index === "metric" || index === "tunnel-vr" ||
                                index === "ike-group-id" || index === "is-hub") {

                                if(index === "tunnel-zone" || index === "metric" ||
                                    index === "protected-zoneinterface" ||
                                    index === "tunnel-vr" || index === "ike-group-id") {
                                    object.hidden = true;
                                }
                            if(index === "certificate" && !self.isCertBasedProfile) {
                                object.hidden = true;
                            }
                            if(index === "is-hub" && !isAggresiveModeProfile) {

                                object.hidden = true;
                            }
                        }
                        });
                    }
                    break;
                case "HUB_N_SPOKE":
                    var isAutoVpn = self.options.returnedData["auto-vpn"];
                    var isAdVpn = self.options.returnedData["advpn"];
                    gridElements.forEach(function (object) {
                        var index = object.index;
                        if(isAutoVpn || isAdVpn) {
                            if(index === "proxy-id" || index === "is-hub") {
                                object.hidden = true;
                            }
                        } else {
                            if(index === "ike-group-id" || index === "is-hub") {
                                object.hidden = true;
                            }
                            if(index === "certificate" && !self.isCertBasedProfile) {
                                object.hidden = true;
                            }
                            if(index === "proxy-id" && isMultiProxyId) {
                                object.hidden = true;
                            }
                        }
                    });
                    break;
                case "FULL_MESH":
                    gridElements.forEach(function (object) {
                        var index = object.index;
                        if(index === "ike-group-id" || index === "is-hub") {
                            object.hidden = true;
                        }
                        if(index === "certificate" && !self.isCertBasedProfile) {
                            object.hidden = true;
                        }
                        if(index === "proxy-id" && isMultiProxyId) {
                            object.hidden = true;
                        }
                    });
                    break;
            }

            return gridElements;
        },

        clearCache: function() {
            var self = this;
            var clearStatus = false;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/reset-cache?ui-session-id='+this.cuid,
                type: 'get',
                success: function(data, status) {
                    clearStatus = true;
                    self.loadVpn();
                },
                async: false,
                error: function(status) {
                    console.log('Unable to clear cache');
                }
            });

            return clearStatus;
        },

        loadVpn: function() {
            var loadStatus = false;
            var self = this;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/'+this.options.selectedRow+'?ui-session-id='+this.cuid,
                type: 'get',
                dataType: 'json',
                headers: {
                   'Accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpn+json;version=1;q=0.01'
                },
                success: function(data, status) {
                    if(status === "success") {
                        self.tunnelMode = data["ipsec-vpn"]["vpn-tunnel-mode-types"];
                        self.vpnType = data["ipsec-vpn"]["type"];
                        loadStatus = true;
                        self.vpnData = data;
                        //self.loadEndpoints();
                        self.getVpnProfileData();
                        self.createEndpointSettingsGrid();
                    }
                },
                async: false,
                error: function(status) {
                    console.log('Unable to load vpn');
                    loadStatus = false;
                }
            });

            return loadStatus;
        },
        loadEndpoints: function() {
            var loadStatus = false;
            var self = this;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/load-endpoint-details?ui-session-id='+this.UUID,
                type: 'get',
                dataType: 'json',
                headers: {
                   'Accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-device-endpoint-details+json;version=1;q=0.01'
                },
                success: function(data, status) {
                    if(status === "success") {
                        self.endpointData = data["devices"]["device"];
                    }
                    loadStatus = true;
                },
                async: false,
                error: function(status) {
                    console.log('Unable to load endpoints');
                    loadStatus = false;
                }
            });

            return loadStatus;
        },

        createViews: function () {
            var self = this;

            var externalInterfaceView = new ExternalInterfaceView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'external-if-name',
                'context': self.context,
                'model' : self.model,
                'fromModify' : true,
                'uuid' : self.UUID
            });

            var tunnelZoneView = new TunnelZoneView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'tunnel-zone',
                'context': self.context,
                'model': self.model,
                'fromModify' : true,
                'uuid' : self.UUID
            });

            var protectedView = new ProtectedEndpointsView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'protected-zoneinterface',
                'context': self.context,
                'model' : self.model,
                'fromModify' : true,
                'vpnData' : self.options.returnedData,
                'uuid' : self.UUID
            });

            var routingInstanceView = new RoutingInstanceView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'tunnel-vr',
                'context': self.context,
                'model' : self.model,
                'fromModify': true
            });

            var routeSettingsView = new RouteSettingsView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'metric',
		        'fromModify' : true,
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false
            });

            var certificateSettingsView = new CertificateSettingsView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'certificate',
                'context': self.context,
                'model' : self.model,
                'vpnData' : self.options.returnedData,
                'fromGlobalSettingsPage': false
            });

            var proxySettingsView = new ProxySettingsView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'proxy-id',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false
            });

            var ikeAddressSettingsView = new IkeAddressSettingsView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'ike-address',
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
                'fromModify' : true,
                'vpnData' : self.options.returnedData,
                'fromGlobalSettingsPage': false
            });

            var initiatorRecipientView = new InitiatorRecipientView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'is-hub',
                'context': self.context,
                'model' : self.model,
                'activity': self,
                'fromGlobalSettingsPage': false
            });

            var cellViews = {
                'external-if-name': externalInterfaceView,
                'tunnel-zone': tunnelZoneView,
                'protected-zoneinterface': protectedView,
                'tunnel-vr': routingInstanceView,
                'metric': routeSettingsView,
                'is-hub': initiatorRecipientView,
                'certificate': certificateSettingsView,
                'proxy-id': proxySettingsView,
                'ike-address': ikeAddressSettingsView,
                'ike-group-id': groupIkeSettingsView
            };

            return cellViews;
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

        save:  function(columnName, data) {
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
            if(data.dataType === "INITIATOR_RECIPIENT")
                this.initiatorRecipient = data;
            if(data.dataType === "GROUPIKE")
                this.ikeGroupId = data;

            this.$el.trigger('updateCellOverlayView',{
                'columnName':columnName,
                'cellData':data.cellData
            });
        },

        close:  function(columnName,e) {
            this.$el.trigger('closeCellOverlayView', columnName);
            e.preventDefault();
        },


        /*
         * modifies a VPN device endpoints
         *
         * Forms the REST call to modify the VPN
         * Gets all data from space model that has saved all settings
         */

        cacheDeviceEndpoints: function(row) {
            var self = this;
            var results;

            var deviceEndpoint = row.updatedRow;
            var originalData = row.originalData;

            var ikeAddress = deviceEndpoint["ike-address"][0];
            var ikeAddressVal = ((ikeAddress != "Not Applicable" && ikeAddress != "" && ikeAddress != undefined) ? ikeAddress : "");


            var requestBody = {"update-endpoint": {
                    "vpn-end-point": {
                        "vpn-device-bean":[{
                            "edit-version"          : originalData["edit-version"],
                            "device-id"             : deviceEndpoint["id"],
                            "device-name"           : deviceEndpoint["device-name"],
                            "device-moid"           : originalData["device-moid"],
                            "extranet-device"       : originalData["extranet-device"],
                            "certificate"           : deviceEndpoint["certificate"][0],
                            "is-hub"                : originalData["is-hub"],
                            "external-if-name"      : deviceEndpoint["external-if-name"][0],
                            "gw-address"            : deviceEndpoint["gw-address"],
                            "tunnel-zone"           : deviceEndpoint["tunnel-zone"][0],
                            "tunnel-vr"             : deviceEndpoint["tunnel-vr"][0],
                            "proxy-id"              : deviceEndpoint["proxy-id"][0],
                            "ike-address"           : ikeAddressVal,
                            "ike-group-id"          : (originalData["ike-group-id"] != undefined ? originalData["ike-group-id"] : ""),
                        }]
                    }
                }
            };

            var exportVal = 'None';
            var metricVal = -1;
            if(deviceEndpoint.metric.length > 0) {
                exportVal = deviceEndpoint.metric[0]; //.substr(deviceEndpoint.metric[0].indexOf('Export:')+8, deviceEndpoint.metric[0].length);
                var metricTempVal = (deviceEndpoint.metric[1] != undefined ? deviceEndpoint.metric[1].substr(deviceEndpoint.metric[1].indexOf('Metric:')+8, deviceEndpoint.metric[1].length) : metricVal);
                if(metricTempVal != "" && metricTempVal != -1){
                    metricVal = parseInt(metricTempVal);
                }
            }

            if(requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['external-if-name'] == undefined)
                requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['external-if-name'] = "";


            requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['metric'] = metricVal;
            requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-static-routes'] = false;
            requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-rip-routes'] = false;
            requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-ospf-routes'] = false;
            requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-default-routes'] = false;

            if(exportVal.indexOf("Static") > 0) {
                requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-static-routes'] = true;
            }
            if (exportVal.indexOf("OSPF") > 0) {
                requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-ospf-routes'] = true;
            }
            if (exportVal.indexOf("RIP") > 0) {
                requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-rip-routes'] = true;
            }
            if (exportVal.indexOf("Default") > 0) {
                requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-default-routes'] = true;
            }
            switch(self.vpnType) {
                case "SITE_TO_SITE":

                   if(self.profileMode === "AGGRESSIVE"){
                        if(deviceEndpoint['is-hub'][0] == "Recipient")
                           requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['is-hub'] = true;
                        else
                           requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['is-hub'] = false;

                   }
                   break;

                case "HUB_N_SPOKE":
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['ike-group-id'] = (this.ikeGroupId != undefined ? this.ikeGroupId.apiData : originalData["ike-group-id"]);
                    if(requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['is-hub'] == false){
                        requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['ike-group-id'] = "";
                    }
                    break;

                case "FULL_MESH":
                    //nothing for now.
                    break;
            }

            // The hash table now saves every edited rows protected network data
            // Get the data to be written to the backend from the hash table
            // that is saved in the space model.  The row id indexes the hash table.

            var map = this.model.get("protectedResourceDataTable");
            var rowId = row.originalData.id;

            if (map) {
                var updateData = map[rowId];
                if (updateData) {
                    // hash table exists and this rows cell data was in the hash table (the cell data from the overlay was previously written into the hash table
                    // at the function save: in this code.
                    // The cell overlay code passes back to the grid view, cellData (rendered text) and apiData (data that is in format for json request).
                    // Take data from the hash table and set the requestbody protected network fields with the values from the apiData.

                    if (updateData.dataType === "INTERFACES") {
                        requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-interfaces"] = {"protected-network-interface":updateData.apiData};
                    } else if (updateData.dataType === "ZONES") {
                        requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-zones"] = {"protected-network-zon":updateData.apiData};
                    } else if (updateData.dataType === "ADDRESS") {
                        requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-networks"] = {"protected-network":updateData.apiData};
                    }; // do nothing for default case because not possible to find this row in hashtable without any protected data
                } else {
                    // hash table exists but can't find this row in hash table so user has never edited this row.
                    // Take the data from the grid original row data and fill in the protected network fields
                    // For protected interfaces and protected zones, backend always returns array of strings even if empty.
                    // For protected networks, backend returns an array of objects except when empty returns a null object (protected-networks: {})

                    if (row.originalData["protected-network-interfaces"]["protected-network-interface"].length !== 0) {
                        requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-interfaces"] = {"protected-network-interface":row.originalData["protected-network-interfaces"]["protected-network-interface"]};
                    } else if (row.originalData["protected-network-zones"]["protected-network-zone"].length !== 0) {
                               requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-zones"] = {"protected-network-zon":row.originalData["protected-network-zones"]["protected-network-zone"]};
                    } else if (row.originalData["protected-networks"] && row.originalData["protected-networks"]["protected-network"]) {
                               // Workaround for backend returning protected-network as a null object instead of an empty array
                               // address data is an array of objects with name, id, domain-id
                               var listValues = [];
                               for(i=0; i < row.originalData["protected-networks"]["protected-network"].length; i++ ) {
                                   listValues.push({
                                       "name": row.originalData["protected-networks"]["protected-network"][i].name,
                                       "id": row.originalData["protected-networks"]["protected-network"][i].id,
                                       "domain-id": row.originalData["protected-networks"]["protected-network"][i]["domain-id"],
                                   });
                               };
                               requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-networks"] = {"protected-network":listValues};
                    } else {
                               // Workaround backend if protected-networks was null object then make request with empty array.
                               // Do this anyway eventhough backend will treat missing protected-network parameter as a null input.
                               requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-networks"] = {"protected-network":[]};
                    }
                };
            } else {
                // There is no hash table - No edits on protected networks so take data from the original row.
                // This is the default case of where user either modified a cell other than protected networks or the user cancelled the first time edit of the protected network cell

                requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-interfaces"] = {"protected-network-interface":row.originalData["protected-network-interfaces"]["protected-network-interface"]};
                requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-zones"] = {"protected-network-zon":row.originalData["protected-network-zones"]["protected-network-zone"]};

                // Next check is workaround for backend returning protected-network as a null object instead of an empty array
                if (row.originalData["protected-networks"] && row.originalData["protected-networks"]["protected-network"]) {
                    // address data is an array of objects with name, id, domain-id
                    var listValues = [];
                    for(i=0; i < row.originalData["protected-networks"]["protected-network"].length; i++ ) {
                        listValues.push({
                            "name": row.originalData["protected-networks"]["protected-network"][i].name,
                            "id": row.originalData["protected-networks"]["protected-network"][i].id,
                            "domain-id": row.originalData["protected-networks"]["protected-network"][i]["domain-id"],
                        });
                    };
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-networks"] = {"protected-network":listValues};
                } else {
                    // Workaround backend if protected-networks was null object then make request with empty array.
                    // Do this anyway eventhough backend will treat missing protected-network parameter as a null input.
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-networks"] = {"protected-network":[]};
                }
            };

            // Remove the prepended label from the json request body before making the backend REST call.
            // In the case of modify, the grid cell configuration formatter will have run and prepended the
            // label "Zone: ", or "Interfaces " to the first entry in the protected list.
            // In the case of "Address: ", the cell configuration formatter does not affect the protected network address
            // because the protected network address is a list of object ids. The formatter can only write strings.
            // Only the protected zones and interfaces have this issue because they are lists of strings.

            if (requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-zones"]) {
                if (requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-zones"]["protected-network-zon"].length !== 0) {
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-zones"]["protected-network-zon"][0] =
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-zones"]["protected-network-zon"][0].replace("Zones: ","");
                };
            };

            if (requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-interfaces"]) {
                if (requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-interfaces"]["protected-network-interface"].length !== 0) {
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-interfaces"]["protected-network-interface"][0] =
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-interfaces"]["protected-network-interface"][0].replace("Interfaces: ","");
                };
            };

            // Create the JSON request string

            jsonRequest = JSON.stringify(requestBody);

            var errorLevel;
            var errorMessage;
            var ikeAddress;

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/update-endpoints-in-cache?ui-session-id='+this.UUID,
                type: 'post',
                dataType: 'json',
                headers: {
                    'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-device-endpoint-details+json;version=1;q=0.01',
                   'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.update-endpoint+json;version=1;charset=UTF-8'
                },
                data: jsonRequest,
                success: function(data, status, response) {
                    errorLevel = data.devices.device[0]['error-level'];
                    errorMessage = data.devices.device[0]['error-message'];
                    ikeAddress = data.devices.device[0]['ike-address'];
                    results = response;
                },
                async: false,
                error: function(response) {
                    results = response;
                }
            });
            row.originalData['error-message'] = errorMessage;
            row.updatedRow['error-message'] = errorMessage;
            row.updatedRow['error-level'] = errorLevel;
            row.updatedRow['ike-address'] = ikeAddress;
            // update the grid with the grid with the data from the backend
            self.grid.editRow(row.updatedRow, row.updatedRow);
            return results;
        },

        saveVpn: function() {
            var saveStatus = false;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/save-endpoints?ui-session-id='+this.UUID+'&overwrite-changes=true',
                type: 'get',
                success: function(data, status) {
                    saveStatus = true;
                },
                async: false,
                error: function(status) {
                    console.log('Unable to clear cache');
                }
            });

            return saveStatus;
        },

        submit: function(event) {
            event.preventDefault();
            this.cacheDeviceEndpoints();
            this.saveVpn();
        },

        cancel: function (event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        getSummary: function() {
            var summary = [];
            var vpnnameLabel = this.context.getMessage('vpn_wizard_endpoint_settings_page_title');
            var hubList = this.activity.model.get("selectedHubDeviceIds");
            var endpointList = this.activity.model.get("selectedEndpointDeviceIds");
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

            return summary;
        },

        /**
         * Return the page title for the wizard.
         *
         * returns String, the page title
         */
        getTitle: function() {
            return this.context.getMessage('vpn_endpoint_settings_form_title');
        },

        beforePageChange:function (currentPage, nextPage) {
            var selfPointer = this;
            this.grid.removeEditModeOnRow();
            return true;
        }
    });

    return ModifyVpnDeviceEndpointsSettingsView;
});
