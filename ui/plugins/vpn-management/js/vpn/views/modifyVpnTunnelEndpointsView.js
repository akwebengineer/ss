/**
 * Module that implements the modify VPN Tunnel Settings page view.
 *
 * @module ModifyVPNTunnelEndpointsView
 * @author Venkata Swaroop <vswaroop@juniper.net>
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
    '../conf/modifyIpsecVpnTunnelsGridConf.js',
    '../models/ipsecVpnDevicesCollection.js',
    './vpnNameInDeviceView.js',
    './modifyVpnProfileView.js',
    './ikeIDSettingsView.js',
    './localProxyView.js',
    './adVpnSettingsView.js',
    './trafficSelectorView.js',
    './preSharedKeyView.js',
    './tunnelInterfaceView.js',
    'widgets/overlay/overlayWidget'
], function (
    Backbone,
    Syphon,
    VPNEndpointSettingsGridConf,
    GridWidget,
    DeviceCollection,
    IpsecVpnCollection,
    IpsecVpnDevicesGridConfig,
    ModifyIpsecVpnTunnelsGridConfig,
    IpsecVpnDevicesCollection,
    VPNNameInDeviceView,
    VPNProfileView,
    IKEIDSettingsView,
    LocalProxyView,
    AdVpnSettingsView,
    TrafficSelectorView,
    PreSharedKeyView,
    TunnelInterfaceView,
    OverlayWidget
) {
   var editRow;
   var urlDevicesHref;
   var tunnelZones = [];
   var vpnProfileIds = [];

    var modifyVpnTunnelsEndpointsView = Backbone.View.extend({

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
            this.actionEvents = {
                updateEvent: "editEvent",
                saveEvent: "saveEvent"
            }

            this.bindGridEvents();
            this.cellOverlayViews = this.createViews();
             this.UUID = this.options.UUID;//Slipstream.SDK.Utils.url_safe_uuid();
             this.context.UUID = this.UUID;
             this.context.vpnId = this.options.vpnSelectedRow;
             this.tunnelMode = "ROUTE_BASED";
             this.vpnType = "SITE_TO_SITE";

        },

        events: {
            'click #ok': 'submit',
            'click #cancel': 'cancel'
        },


        bindGridEvents: function (){
            var self = this;
            this.$el.bind(this.actionEvents.updateEvent, $.proxy(this.onEditEvent, this));
            this.$el.bind(this.actionEvents.saveEvent, $.proxy(this.saveVpn, this));
        },

        getVpnProfileData: function(vpnProfile) {
            var profileId = "";
            var self = this;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-profiles',
                type: 'get',
                headers: {
                   'accept': 'application/vnd.juniper.sd.vpn-management.vpn-profiles+json;version=1;q=0.01'
                },
                success: function(data, status) {
                    data['vpn-profiles']['vpn-profile'].forEach(function(object) {
                        if (vpnProfile == object.name) {
                            profileId = object.id;
                            return profileId;
                        }
                    });
                },
                error: function() {
                    console.log('VPN Profiles not fetched');
                },
                async: false
            });
            return profileId;
        },

        /* Load Tunnel Endpoints into Cache */
        tunnelEndpointsCache: function(device_MOID) {

            var requestBody = {"cache-tunnel-endpoints": {
                                  "device-moid": device_MOID
                              }
                        };
            jsonRequest = JSON.stringify(requestBody);
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/cache-tunnel-endpoints?ui-session-id=' + this.UUID,
                type: 'post',
                dataType: 'json',
                data: jsonRequest,
                headers: {
                   "Accept": 'application/vnd.juniper.sd.vpn-management.ipsec-vpn.cache-tunnel-details-response+json;version=1;q=0.01',
                   "content-type": 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.cache-tunnel-details+json;version=1;charset=UTF-8'
                },
                success: function(data, status) {
                    console.log('status :'+status);
                },
                async: false,
                error: function(status) {
                    console.log('Unable to get Tunnel Endpoints Data ');
                }
            });
        },

        /*
         * modifies a VPN tunnels
         *
         * Forms the REST call to modify the VPN
         * Gets all data from space model that has saved all settings
         */

        cacheTunnels: function(row) {
            var self = this;
            var results;
            var updatedEndpoint = row.updatedRow;
            var originalData = row.originalData;

            var arrObject =[];

            if(updatedEndpoint["traffic-selectors.traffic-selector"][0] != undefined) {
                for(var a=0; a < updatedEndpoint["traffic-selectors.traffic-selector"].length; a++) {
                    var tsObject = {};
                    var tsRec = updatedEndpoint["traffic-selectors.traffic-selector"][a].split(",");
                    tsObject["name"] = tsRec[0].substr(6, tsRec[0].length);
                    tsObject["local-ip"] = tsRec[1].substr(8, tsRec[1].length);
                    tsObject["remote-ip"] = tsRec[2].substr(9, tsRec[2].length);
                    arrObject.push(tsObject);

                }
            }

            var profileID = this.getVpnProfileData(updatedEndpoint['profile.name']);
            var shortcutConnList = "-1";
            var idleThreshold = -1;
            var idleTime = -1;
            if(updatedEndpoint["advpn-settings"] == "Not Applicable") {
                 shortcutConnList = "-1";
                 idleThreshold = -1;
                 idleTime = -1;

            }else{
              if(updatedEndpoint["advpn-settings"][0].split(":")[1] != "") {
                  shortcutConnList = updatedEndpoint["advpn-settings"][0].split(":")[1];

              }
              if(updatedEndpoint["advpn-settings"][1]){
                  if(updatedEndpoint["advpn-settings"][1].split(":")[1] !== "") {
                     idleThreshold = parseInt(updatedEndpoint["advpn-settings"][1].split(":")[1]);idleTime
                  }
              }
              if(updatedEndpoint["advpn-settings"][2]){
                  if(updatedEndpoint["advpn-settings"][2].split(":")[1] != "") {
                    idleTime = parseInt(updatedEndpoint["advpn-settings"][2].split(":")[1]);
                  }
              }

            }
            var ikeIdValue = "";
            var ikeIdTypeValue = "";
                //incase of NONE, only IKE ID Type will come. IKE ID will be non-editable field.
                if(updatedEndpoint["ike-id"][0].substr(12) == "None"){
                    ikeIdTypeValue = "NONE";
                } else {
                    //IKE ID : will come in "updatedEndpoint["ike-id"][0]". So we take the substring to get ike id.
                    ikeIdValue = updatedEndpoint["ike-id"][0].substr(7);
                    //IKE ID TYpe: will come in "updatedEndpoint["ike-id"][1]"
                    ikeIdTypeValue = updatedEndpoint["ike-id"][1].substr(12);

                    if(ikeIdTypeValue == "Hostname") {
                           ikeIdTypeValue = "Host Name";
                    } else if (ikeIdTypeValue == "User@hostname") {
                            ikeIdTypeValue = "User At Hostname";
                    } else if (ikeIdTypeValue == "IPAddress"){
                            ikeIdTypeValue = "IP Address";
                    }else if (ikeIdTypeValue == "DN"){
                            ikeIdTypeValue = "DN"
                    }
                }

            var localProxyID = "";
            var remoteProxyID = "";

            if(updatedEndpoint["local-proxyid"].length == 2) {
                localProxyID = updatedEndpoint["local-proxyid"][0].substr(7, updatedEndpoint["local-proxyid"][0].length);
                remoteProxyID = updatedEndpoint["local-proxyid"][1].substr(8, updatedEndpoint["local-proxyid"][1].length);
            }
            if(updatedEndpoint["local-proxyid"].length ==1) {
                if(updatedEndpoint["local-proxyid"][0].indexOf("Local") == 0) {
                        localProxyID = updatedEndpoint["local-proxyid"][0].substr(7, updatedEndpoint["local-proxyid"][0].length);
                } else {
                        remoteProxyID = updatedEndpoint["local-proxyid"][0].substr(8, updatedEndpoint["local-proxyid"][0].length);
                }
            }

            var requestBody = {"update-tunnel-endpoints": {
                "vpn-device-tunnels": {
                        "vpn-end-point"         : {
                            "ike-id"                : ikeIdValue,
                            "ike-type"              : ikeIdTypeValue,
                            "vpn-name-in-device"    : (updatedEndpoint["vpn-name-in-device"] != undefined ? updatedEndpoint["vpn-name-in-device"][0] : ""),
			    "device-name"           : (updatedEndpoint["device-name"] != undefined ? updatedEndpoint["device-name"] : ""),
                            "local-proxyid"         : localProxyID,
                            "remote-proxyid"        : remoteProxyID,
                            "max-transmission-unit" : (updatedEndpoint["max-transmission-unit"] != undefined && updatedEndpoint["max-transmission-unit"] != "" ? updatedEndpoint["max-transmission-unit"] : -1),
                            "preshared-key"         : (updatedEndpoint["preshared-key"] !=undefined ? updatedEndpoint["preshared-key"][0] : ""),
                            "tunnel-address"        : (updatedEndpoint["tunnel-address"] != undefined ? updatedEndpoint["tunnel-address"][0]  : ""),
                            "tunnel-if-name"        : (updatedEndpoint["tunnel-if-name"] != undefined ? updatedEndpoint["tunnel-if-name"]: "" ),
//                            "profile"               : {
//                                "name"              : (updatedEndpoint['profile.name'] != undefined ? updatedEndpoint['profile.name'][0] : ""),
//                                "id"                : (profileID != "" ? profileID : -1)
//                            },
                            "traffic-selectors"     : {
                                "traffic-selector"  : arrObject
                            },
                            "advpn-settings"        : {
                              "shortcut-conn-limit" : shortcutConnList,
                              "idle-threshold"      : idleThreshold,
                              "idle-time"           : idleTime
                            },
                            "id"                    : originalData["id"]
                         }
                    }
                }
            };

            //jsonRequest = JSON.stringify(requestBody);

          $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/update-tunnels-in-cache?ui-session-id='+ this.UUID,

                type: 'post',
                dataType: 'json',
                headers: {
                    'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.update-tunnels+json;version=1;charset=UTF-8',
                    'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-device-tunnel-details+json;version=1;q=0.01'
                },
                data: JSON.stringify(requestBody),
                success: function(responseTunnel) {
                    results = responseTunnel;
                },
                async: false,
                error: function(response) {
                    results = response;
                }
            });

            return results;
        },
        applyProfiles: function(row) {
            var self = this;
            var results;
            var updatedEndpoint = row.updatedRow;
            var originalData = row.originalData;

            var arrObject =[];
            var profileID = this.getVpnProfileData(updatedEndpoint['profile.name']);
            var requestBody = {"apply-profile-to-tunnel-tunnels": {
                                    "vpn-device-tunnel": {
                                                  "id":updatedEndpoint["id"],
                                                  "MOID":"net.juniper.space.sd.vpnmanager.jpa.IPSecVPNEndPointEntity:"+updatedEndpoint["id"]
                                                  },
                                                  "vpn-profile-moid":"net.juniper.space.sd.vpnmanager.jpa.IPSecVPNProfileEntity"+":"+profileID
                                    }
                                };
                                jsonRequest = JSON.stringify(requestBody);
                                 $.ajax({
                                            url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/apply-profile-to-tunnel?ui-session-id='+ this.UUID,

                                            type: 'post',
                                            dataType: 'json',
                                            headers: {
                                                'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.apply-profile-to-tunnel+json;version=1;charset=UTF-8',
                                                'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-device-tunnel-details+json;version=1;q=0.01'
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
        /* Triggered when edit option for a selected device is unchecked */
        onEditEvent: function(e, row){
            this.cacheTunnels(row);
            //this.applyProfiles(row);
        },

        /* Final call of the page to save changes*/

        saveVpn: function() {

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

         submit: function(event) {
            event.preventDefault();
      //      this.cacheTunnels();
            this.saveVpn();
         },

        cancel: function (event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },


        /* Overlay windows*/

        createViews: function () {
            var self = this;

            var vpnNameInDeviceView = new VPNNameInDeviceView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'vpn-name-in-device',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false
            });

            var vpnProfileView = new VPNProfileView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'profile.name',
                'context': self.context,
                'model' : self.model,
                'profile' : self.options.updatedVPNDetails.profile,
                'fromGlobalSettingsPage': false
            });

             var ikeIDSettingsView = new IKEIDSettingsView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'ike-id',
                'context': self.context,
                'model' : self.model,
                'isCertBasedProfile': self.options.isCertBasedProfile,
                'fromGlobalSettingsPage': false
             });

            var localProxyView = new LocalProxyView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'local-proxyid',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false
            });

            var adVpnSettingsView = new AdVpnSettingsView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'advpn-settings',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false
            });

            var tunnelInterfaceView = new TunnelInterfaceView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'tunnel-address',
                'context': self.context,
                'activity': self,
                'model' : self.model,
                'fromGlobalSettingsPage': false
            });

             var trafficSelectorView = new TrafficSelectorView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'traffic-selectors.traffic-selector',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false
             });

            var preSharedKeyView = new PreSharedKeyView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'preshared-key',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': false
            });

            var cellViews = {
                'vpn-name-in-device'                    : vpnNameInDeviceView,
                'profile.name'                          : vpnProfileView,
                'ike-id'                                : ikeIDSettingsView,
                'local-proxyid'                         : localProxyView,
                'advpn-settings'                        : adVpnSettingsView,
                'tunnel-address'                        : tunnelInterfaceView,
                'traffic-selectors.traffic-selector'    : trafficSelectorView,
                'preshared-key'                         : preSharedKeyView
            };

            return cellViews;
        },

        save:  function(columnName, data) {
            this.$el.trigger('updateCellOverlayView',{
                'columnName':columnName,
                'cellData':data
            });
        },

        close:  function(columnName,e) {
            this.$el.trigger('closeCellOverlayView', columnName);
          //  e.preventDefault();
        },

        // Wizard Page View required functions

        /**
         * Renders the form view.
         *
         * returns this object
         */
        render: function() {
            var self = this;
            this.tunnelEndpointsCache(self.options.selectedDeviceMOID);
            this.createTunnelSettingsGrid();
            return self;
        },

        /* Method to load tunnel details for selected VPN device*/

        createTunnelSettingsGrid : function() {
            var self = this;
            var gridConf = new ModifyIpsecVpnTunnelsGridConfig(this.context,
                                                               this.options.updatedVPNDetails["multi-proxyid"],
                                                               this.options.updatedVPNDetails["advpn-settings"],
                                                               this.options.updatedVPNDetails["auto-vpn"],
                                                               this.options.updatedVPNDetails["profile"]);
            var gridValues = gridConf.getValues(this.UUID);
            this.setGridColumns(gridValues.columns);

            this.grid = new GridWidget({
              container: this.el,
              elements: gridValues,
              actionEvents: self.actionEvents,
              cellOverlayViews: self.cellOverlayViews
            }).build();
             this.$el.find('dd.edit,dd.disabled').hide();
        },

        /* Method to hide grid columns based on conditions */

        setGridColumns: function(gridElements) {
            var interfaceType = this.options.updatedVPNDetails["tunnel-interface-type"];
            var isMultiProxy = this.options.updatedVPNDetails["multi-proxyid"];
            var tunnelModeType = this.options.updatedVPNDetails["vpn-tunnel-mode-types"];
            var autoVPN = this.options.updatedVPNDetails["auto-vpn"];
            var vpnProfileDetails = this.options.updatedVPNDetails["profile"];
            var SITE_TO_SITE = this.options.updatedVPNDetails["type"];
            var isGeneralIkeIdProfile = this.options.updatedVPNDetails["isGeneralIkeIdProfile"];

            if(autoVPN) {
                 gridElements.forEach(function (object) {
                   if(object.index === "profile.name"){
                   object.hidden = true;
                  }
               });
            }

            if(isGeneralIkeIdProfile && vpnProfileDetails.authMethod === "PRESHARED_KEY") {
                 gridElements.forEach(function (object) {
                   if(object.index === "ike-id"){
                   object.hidden = true;
                  }
               });
            }

            /* if the type is site-to- site , VPN Customisation is not allowed */
            if(SITE_TO_SITE === "SITE_TO_SITE"){
                gridElements.forEach(function (object) {
                   if(object.index === "profile.name"){
                    object.hidden = true;
                  }
               });
            }

            var isCertBasedProfile = this.options.isCertBasedProfile;
            if(isMultiProxy) {
                gridElements.forEach(function (object) {
                    if(object.index === "local-proxyid") {
                        object.collapseContent = false;
                        object.formatter = formatProxyIdCell;
                    }
                });
            } else {
                gridElements.forEach(function (object) {
                    if(object.index === "traffic-selectors.traffic-selector") {
                        object.collapseContent = false;
                        object.formatter = formatTunnelSelectorCell;
                    }
                });
            }


            if((this.context.vpnTypeCon == "SITE_TO_SITE") || (this.context.vpnTypeCon == "FULL_MESH") || (this.options.updatedVPNDetails["advpn"]) !=true || this.context.selRow == "HUB") {
                gridElements.forEach(function (object) {
                    if(object.index === "advpn-settings") {
                        object.collapseContent = false;
                    object.formatter = formatNotApplicableCell;
                    }
                });
            }

            if((interfaceType === "NUMBERED") || (tunnelModeType === "POLICY_BASED")) {
               gridElements.forEach(function (object) {
                    if(object.index === "max-transmission-unit") {
                        object.hidden = true;
                    }
               });
            }
            if(interfaceType === "UNNUMBERED") {
               gridElements.forEach(function (object) {
                    if(object.index === "tunnel-address") {
                        object.hidden = true;
                    }
               });
            }

            gridElements.forEach(function (object) {
                if(object.index === "preshared-key" && isCertBasedProfile) {
                    object.hidden = true;
                }
                if(object.index === "local-proxyid" && autoVPN) {
                    object.collapseContent = false;
                    object.formatter = formatProxyIdCell;
                }
            });

            return gridElements;
        },

        /**
         * Return the page title for the wizard.
         *
         * returns String, the page title
         */
        getTitle: function() {
            return this.context.getMessage('ipsec_vpns_tunnels_grid_title');
        }

    });

    return modifyVpnTunnelsEndpointsView;

});
