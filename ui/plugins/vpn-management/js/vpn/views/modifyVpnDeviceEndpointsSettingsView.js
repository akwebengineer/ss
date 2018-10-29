/**
 * Module that implements the Modify VPN Endpoint Settings page view.
 *
 * @module ModifyVpnDeviceEndpointsSettingsView
 * @author balasaritha <balasaritha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    '../conf/vpnEndpointSettingsGridConf.js',
    'widgets/grid/gridWidget',
    '../models/deviceCollection.js',
    '../models/ipsecVpnCollection.js',
    '../conf/ipsecVpnDevicesGridConf.js',
    '../models/ipsecVpnDevicesCollection.js',
    './externalInterfaceView.js',
    './tunnelZoneView.js',
    './protectedEndpointsView.js',
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
    VPNEndpointSettingsGridConf,
    GridWidget,
    DeviceCollection,
    IpsecVpnCollection,
    IpsecVpnDevicesGridConfig,
    IpsecVpnDevicesCollection,
    ExternalInterfaceView,
    TunnelZoneView,
    ProtectedView,
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
            this.ipsecVpnCollection = new IpsecVpnCollection();
            this.ipsecVpnDevicesCollection = new IpsecVpnDevicesCollection();
            this.actionEvents = {
                updateEvent: "editEvent",
                saveEvent: "saveEvent",
                viewTunnelEvent: "viewTunnelEvent"
            }

            this.bindGridEvents();
            this.cuid = Slipstream.SDK.Utils.url_safe_uuid();
            this.tunnelMode = "ROUTE_BASED";
            this.vpnType = "SITE_TO_SITE";
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
                var linkValue = deviceSelectedRow.selectedRows[0].id;

                var options = {
                    activity: self,
                    context: self.context,
                    selectedRow: linkValue,
                    vpnSelectedRow: vpnSelectedRow
                };

                self.overlay = new OverlayWidget({
                    view: new modifyVpnTunnelEndpointsView(options),
                    type: "wide",
                    okButton: true,
                    showScrollbar: true
                });
                self.overlay.build();
            }
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

        handleRowDataEdit : function(editRow) {
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
            this.clearCache();
            return this;
        },

        createEndpointSettingsGrid : function(){
            var self = this;

            var gridConf = new IpsecVpnDevicesGridConfig(this.context, this.options.selectedRow, this.cuid);
            var gridValues = gridConf.getValues();
            this.setGridColumns(gridValues.columns);
            this.cellOverlayViews = this.createViews();

            this.grid = new GridWidget({
               container: this.el,
               elements: gridValues,
               actionEvents: self.actionEvents,
               cellOverlayViews: self.cellOverlayViews,
               cellTooltip: self.cellTooltip
            }).build();
        },

        setGridColumns: function(gridElements) {
            var self = this;
            switch(this.vpnType) {
                case "SITE_TO_SITE":
                    var routingType = "";
                    var isMultiProxyId,
                        isRouting,
                        isProtectedResource,
                        isAggresiveModeProfile = new Boolean(false);

                    isMultiProxyId = self.vpnData["ipsec-vpn"]["multi-proxyid"];
                    routingType = self.vpnData["ipsec-vpn"]["routing-type"];

                    if(routingType === "OSPF" || routingType === "RIP") {
                        isRouting = true;
                    }
                    if(isRouting || routingType === "STATIC") {
                        isProtectedResource = true;
                    }
                    isAggresiveModeProfile = (self.vpnData["ipsec-vpn"]["profile"]["name"] === "AggressiveModeProfile" ? true : false);

                    if(this.tunnelMode === "ROUTE_BASED") {

                        gridElements.forEach(function (object) {
                            var index = object.index;
                            if(index === "metric" || index === "ike-group-id") {
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
                            if(index === "protected-networks.protected-network.name" && !isProtectedResource) {
                                object.hidden = true;
                            }
                        });
                    } else {
                        gridElements.forEach(function (object) {
                            var index = object.index;

                            if(index === "tunnel-zone" ||index === "protected-network-zones.protected-network-zone" ||
                                index === "metric" || index === "tunnel-vr" ||
                                index === "ike-group-id" || index === "is-hub") {

                                if(index === "tunnel-zone" || index === "metric" ||
                                    index === "protected-networks.protected-network.name" ||
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
                    var isAutoVpn = self.vpnData["ipsec-vpn"]["auto-vpn"];
                    var isAdVpn = self.vpnData["ipsec-vpn"]["advpn"];
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
                            if(index === "proxy-id" && !isMultiProxyId) {
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

        getVpnProfileData: function() {
            var self = this;
            var profileId = self.vpnData["ipsec-vpn"]["profile"].id;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-profiles/'+profileId,
                type: 'get',
                dataType: 'json',
                headers: {
                   'accept': 'application/vnd.juniper.sd.vpn-management.vpn-profile+json;q=0.01;version=1'
                },
                success: function(data, status) {
                    var authMethod = data['vpn-profile']['phase1-setting']['auth-method'];
                    self.isCertBasedProfile = false;
                    if(authMethod === "RSA_SIGNATURE" || authMethod === "DSA_SIGNATURE"
                        || authMethod === "EC_DSA_SIGNATURE_256" || authMethod === "EC_DSA_SIGNATURE_384") {
                        self.isCertBasedProfile = true;
                    }
                },
                error: function() {
                    console.log('vpn profile data not fetched');
                },
                async: false
            });
        },

        loadEndpoints: function() {
            var loadStatus = false;
            var self = this;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/load-endpoint-details?ui-session-id='+this.cuid,
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
                'fromModify' : true
            });

            var tunnelZoneView = new TunnelZoneView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'tunnel-zone',
                'context': self.context,
                'model': self.model,
                'fromModify' : true
            });

            var protectedView = new ProtectedView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'protected-networks.protected-network',
                'context': self.context,
                'model' : self.model,
                'fromModify' : true
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
                'vpnData' : self.vpnData,
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
                'fromGlobalSettingsPage': false
            });

            var initiatorRecipientView = new InitiatorRecipientView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'is-hub',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false
            });

            var cellViews = {
                'external-if-name': externalInterfaceView,
                'tunnel-zone': tunnelZoneView,
                'protected-networks.protected-network': protectedView,
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
                // Save the data that will be sent to backend cache

                this.protectedResource = data;

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
            var requestBody = {"update-endpoint": {
                    "vpn-end-point": {
                        "vpn-device-bean":[{
                            "edit-version"          : originalData["edit-version"],
                            "device-id"             : deviceEndpoint["id"],
                            "device-name"           : deviceEndpoint["device-name"],
                            "device-moid"           : originalData["device-moid"],
                            "extranet-device"       : originalData["extranet-device"],
                            "is-hub"                : originalData["is-hub"],
                            "external-if-name"      : deviceEndpoint["external-if-name"][0],
                            "gw-address"            : deviceEndpoint["gw-address"],
                            "tunnel-zone"           : deviceEndpoint["tunnel-zone"][0],
                            "tunnel-vr"             : deviceEndpoint["tunnel-vr"][0],
                            "proxy-id"              : deviceEndpoint["proxy-id"][0],
                            "ike-address"           : deviceEndpoint["ike-address"][0],
                            "ike-group-id"          : (deviceEndpoint["ike-group-id"][0] != undefined ? deviceEndpoint["ike-group-id"][0] : ""),
                            "protected-network-zones"   : {
                                    "protected-network-zon" : []
                                },
                            "protected-network-interfaces" : {
                                    "protected-network-interface" : []
                                },
                            "protected-networks"   : {
                                "protected-network" : []
                            }
                        }]
                    }
                }
            };

            switch(self.vpnType) {
                case "SITE_TO_SITE":
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['certificate'] = deviceEndpoint["certificate"][0];
                    if(this.initiatorRecipient != undefined) {
                        requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['is-hub'] = this.initiatorRecipient.apiData;
                    }
                    break;

                case "HUB_N_SPOKE":
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['metric'] = deviceEndpoint["metric"][0];
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-static-routes'] = deviceEndpoint["export-static-routes"];
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-rip-routes'] = deviceEndpoint["export-rip-routes"];
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-ospf-routes'] = deviceEndpoint["export-ospf-routes"];
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-default-routes'] = deviceEndpoint["export-default-routes"];
                    break;

                case "FULL_MESH":
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['metric'] = deviceEndpoint["metric"][0];
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-static-routes'] = deviceEndpoint["export-static-routes"];
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-rip-routes'] = deviceEndpoint["export-rip-routes"];
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-ospf-routes'] = deviceEndpoint["export-ospf-routes"];
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]['export-default-routes'] = deviceEndpoint["export-default-routes"];
                    break;
            }

            if(this.protectedResource != undefined) {
                if(this.protectedResource.dataType === "ZONES") {
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-zones"] = {"protected-network-zon":this.protectedResource.apiData};
                } else if(this.protectedResource.dataType === "INTERFACES") {
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-network-interfaces"] = {"protected-network-interface":this.protectedResource.apiData};
                } else {
                    requestBody['update-endpoint']['vpn-end-point']['vpn-device-bean'][0]["protected-networks"] = {"protected-network":this.protectedResource.apiData};
                }
            }

            jsonRequest = JSON.stringify(requestBody);

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/update-endpoints-in-cache?ui-session-id='+this.cuid,
                type: 'post',
                dataType: 'json',
                headers: {
                    'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-device-endpoint-details+json;version=1;q=0.01',
                   'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.update-endpoint+json;version=1;charset=UTF-8'
                },
                data: jsonRequest,
                success: function(data, status, response) {
                    results = response;
                },
                async: false,
                error: function(response) {
                    results = response;
                }
            });

            return results;
        },

        saveVpn: function() {
            var saveStatus = false;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/save-endpoints?ui-session-id='+this.cuid+'&overwrite-changes=true',
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

        /**
         * Return the page title for the wizard.
         *
         * returns String, the page title
         */
        getTitle: function() {
            return this.context.getMessage('vpn_endpoint_settings_form_title');
        }
    });

    return ModifyVpnDeviceEndpointsSettingsView;
});
