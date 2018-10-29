/* Module that implements the VPN Tunnel/Route/Global Settings page view.
 * This view's model is a view-model and not a data-model for the backend.
 * Owner of this view must convert the data-model to view-model at the time
 * of instantiating this view and convert the view-model to data-model 
 * at the time of saving data/settings to the backend.
 *
 * @module VpnTunnelRouteGlobalSettingsPageView
 * @author Jangul Aslam <jaslam@juniper.net>
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    '../conf/vpnTunnelRouteGlobalSettingsFormConf.js',
    'widgets/form/formWidget',
    '../conf/globalSettingsGridConf.js',
    'widgets/grid/gridWidget',
    'widgets/listBuilder/listBuilderWidget',
    '../models/deviceCollection.js',
    '../models/ipsecVpnCollection.js',
    '../conf/ipsecVpnDevicesGridConf.js',
    '../models/ipsecVpnDevicesCollection.js',
    './externalInterfaceView.js',
    './tunnelZoneView.js',
    './protectedView.js',
    './certificateView.js',
    './groupIkeSettingsView.js',
    'widgets/overlay/overlayWidget'
], function (
    Backbone,
    Syphon,
    VpnTunnelRouteGlobalSettingsFormConf,
    FormWidget,
    GlobalSettingsGridConf,
    GridWidget,
    ListBuilderWidget,
    DeviceCollection,
    IpsecVpnCollection,
    IpsecVpnDevicesGridConfig,
    IpsecVpnDevicesCollection,
    ExternalInterfaceView,
    TunnelZoneView,
    ProtectedView,
    CertificateView,
    GroupIkeSettingsView,
    OverlayWidget
) {
   var editRow;
   var urlDevicesHref;
   var tunnelZones = [];
   var externalInterfaces = [];

    var VpnTunnelRouteGlobalSettingsPageView = Backbone.View.extend({


        // events registration
        events: {
            "click input[name=interface-type]": "onClickInterfaceType",
            "click input[name=no-of-spokes]": "onClickNoOfSpokes",
            "click input[name=routing-options]": "onClickRoutingOptions"
        },

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
            // uuid is generated at start of wizard and passed to each page
            this.uuid = options.uuid;
            this.actionEvents = {
                updateEvent: "editEvent"

            }

            // set default values in view-model for proper rendering of ui
            if (! this.model.has('interfaceType')) {
                this.model.set('interfaceType', "UNNUMBERED");
            }
            if (! this.model.has('noOfSpokes')) {
                this.model.set('noOfSpokes', "ALL");
            }
            if (! this.model.has('routingOptions')) {
                this.model.set('routingOptions', "STATIC");
            }
            this.cellOverlayViews = this.createViews();

        },
        bindGridEvents: function (){
            var self = this;
            this.$el
                .bind(this.actionEvents.updateEvent, function (e, gridRowsObject) {
                    console.log('updateEvent');
                    // (Single row action) More drop down | Context menu : Edit -> Ok
//                    self.updateGlobalSettings(gridRowsObject, "update");
                })
                .bind(this.actionEvents.statusEvent, function(e, updatedGridRow){
                    console.log("updatedGridRow");
                })
                .bind("gridRowOnEditMode", function (e, editModeRow) {
                    self.handleRowDataEdit(editModeRow);
                });
        },

        createViews: function () {
            var self = this;

            var externalInterfaceView = new ExternalInterfaceView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'external-if-name',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': true,
		'uuid' : self.uuid
            });

            var tunnelZoneView = new TunnelZoneView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'tunnel-zone',
                'context': self.context,
                'model': self.model,
                'fromGlobalSettingsPage': true,
		'uuid' : self.uuid
            });

            var protectedView = new ProtectedView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'protected-zoneinterface',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': true,
                'uuid': self.uuid
            });

            var groupIkeSettingsView = new GroupIkeSettingsView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'ike-group-id',
                'context': self.context,
                'model' : self.model,
                'fromModify':false,
                'fromGlobalSettingsPage': true
            });

            var certificateView = new CertificateView({
                'save': _.bind(self.save, self),
                'close': _.bind(self.close, self),
                'columnName': 'certificate',
                'context': self.context,
                'model' : self.model,
                'fromGlobalSettingsPage': true
            });

            var cellViews = {
                'external-if-name': externalInterfaceView,
                'tunnel-zone': tunnelZoneView,
                'protected-zoneinterface': protectedView,
                'ike-group-id': groupIkeSettingsView,
                'certificate': certificateView
            };

            return cellViews;
        },

        save:  function(columnName, data) {
            // The Global Settings grid is not backed by a backend REST call.
            // The Global Settings grid can not be restored with a single REST get call.
            // All the items that will be redisplayed in this grid are saved in the space model
            // as separate objects and the code has to individually restore values in the grid.
            //
            // All grid displays are restored from the data saved in the space model.
            // Elsewhere in this view code, the External Interface, Tunnel Zone, Certificate come
            // from the Grid. The items that are a single string can be read from the grid.
            // The protected zone, protected interface are complex objects saved in the space model.
            // The rest of the view code uses the space model to access the values set in the protected resources overlay.

            // Save the Protected ZONES and Protected Interfaces in the space model.
            // This code has to take into account that the hub and spokes can have different protected resources.
            if ((data.dataType === "ZONES") || (data.dataType === "INTERFACES")) {
                // Based on selected grid, row Save cell data in endpoint or hub space model
                var row = this.grid.getSelectedRows();
                if (row[0].type === "Hub") {
                    this.model.set("globalSettingsProtectedHub", data);
                    this.model.set("endpointSettingsProtectedResourceHub", data);
                } else {
                    this.model.set("globalSettingsProtectedEndpoint", data);
                    this.model.set("endpointSettingsProtectedResource", data);
                };

            };
            if(data.dataType === "GROUPIKE")
                this.model.set("globalSettingsGroupIke", data);

            this.$el.find('.globalsettingsgrid').trigger('updateCellOverlayView',{
                'columnName':columnName,
                'cellData':data.cellData
            });
        },
        close:  function(columnName,e) {
            this.$el.find('.globalsettingsgrid').trigger('closeCellOverlayView', columnName);
            e.preventDefault();
        },

        // Wizard Page View required functions

        /**
         * Renders the form view.
         * 
         * returns this object
         */
        render: function() {
            var globalSettings = this.model.get("globalsettingsbuttons");
            var globalProperties = this.model.get("globalsettingsproperties");
	    this.bindGridEvents();
            this.formWidget = new FormWidget({
                'elements': VpnTunnelRouteGlobalSettingsFormConf.getConfiguration(this.context),
                'container': this.el,
                'values': this.model.attributes
            });
            this.formWidget.build();

            // two-way binding

            this.createGlobalSettingsGrid();

            // trigger clicks if radio is in checked state 
            this.$el.find("input[type='radio']:checked").click();
            this.$el.find(".action-filter-container").hide(); //PR 1147530
            // render the saved buttons
            if (globalSettings) {
                this.$el.find('#interface-type-unnumbered-id').prop('checked', globalSettings["unnumbered"]);
                this.$el.find('#interface-type-numbered-id').prop('checked', globalSettings["numbered"]);
                this.$el.find('#no-of-spokes-all-id').prop('checked', globalSettings["no-of-spokes-all"]);
                this.$el.find('#no-of-spokes-id').prop('checked', globalSettings["no-of-spokes"]);
              
                this.$el.find('#routing-options-static-id').prop('checked', globalSettings["static"]);
                this.$el.find('#routing-options-ospf-id').prop('checked', globalSettings["ospf"]);
                this.$el.find('#routing-options-rip-id').prop('checked', globalSettings["rip"]);
                this.$el.find('#routing-options-none-id').prop('checked', globalSettings["none"]);

                this.$el.find('#static-routes').prop('checked', globalSettings["static-routes"]);
                this.$el.find('#ospf-routes').prop('checked', globalSettings["ospf-routes"]);
                this.$el.find('#rip-routes').prop('checked', globalSettings["rip-routes"]);

                this.$el.find('#spoke-to-spoke-communication').prop('checked', globalSettings["spoke-to-spoke-communication"]);
                if (globalSettings["numbered"])
                    this.$el.find('#interface-type-numbered-id').click();

                if (globalSettings["static"])
                    this.$el.find('#routing-options-static-id').click();

                if (globalSettings["ospf"])
                    this.$el.find('#routing-options-ospf-id').click();

                if (globalSettings["rip"])
                   this.$el.find('#routing-options-rip-id').click();

                if (globalSettings["none"])
                    this.$el.find('#routing-options-none-id').click();
            };

            // Render the saved properties
            if (globalProperties) {
                this.$el.find("#network-ip-address").val(globalProperties["network-ip-address"]);
                this.$el.find("#network-ip-cidr").val(globalProperties["network-ip-cidr"]);
                this.$el.find("#network-ip-subnet-mask").val(globalProperties["network-ip-subnet-mask"]);
                if(globalProperties["no-of-spokes"] != "ALL") {
                     this.$el.find("#no-of-spokes-value").val(globalProperties["no-of-spokes-value"]);
                } else {
                     this.$el.find("#no-of-spokes-value").val("");
                }
                this.$el.find("#area-id").val(globalProperties["area-id"]);
                this.$el.find("#max-retransmission-time").val(globalProperties["max-retransmission-time"]);
            };

            var vpnGeneralSettings = this.model.get("generalsettings");
            var autoVpn = vpnGeneralSettings["auto-vpn"];
            var adVpn = vpnGeneralSettings["advpn"];
            if(autoVpn || (autoVpn && adVpn)) {
                this.$el.find('#interface-type-numbered-id').attr('checked',true).trigger("click");
                this.$el.find('#interface-type-numbered-id').hide();
                this.$el.find("#interface-type-unnumbered-id").closest("div.optionselection").hide();
            }
            if(vpnGeneralSettings["multi-proxyid-enable"] && (vpnGeneralSettings["vpn-type"] == "FULL_MESH" || vpnGeneralSettings["vpn-type"] == "HUB_N_SPOKE" )) {
                this.$el.find("#interface-type-numbered-id").closest("div.optionselection").hide();
                this.$el.find('#interface-type-unnumbered-id').hide();
            }
           if(vpnGeneralSettings["tunnel-mode"]==="POLICY_BASED") {

                this.formWidget.conf.container.find('form#vpn-trg-settings-settings .form_section').hide();

                this.formWidget.showFormError(this.context.getMessage('vpn_policy_based_no_tunnel_setting_error'));

           } else if (vpnGeneralSettings["multi-proxyid-enable"]) {
                this.$el.find('#route-settings').hide();
           } else {
                this.$el.find('#route-settings').show();
                this.$el.find('#tunnel-settings').show();
                this.$el.find('.globalsettingsgrid').show();
           }

           if(autoVpn) {
               this.$el.find("#routing-options-static-id").closest("div.optionselection").hide();
               this.$el.find('#routing-options-ospf-id').attr('checked',true).trigger("click");
           }

           if(this.$el.find('#interface-type-numbered-id')[0].value == "NUMBERED"){
                 if(autoVpn || (autoVpn && adVpn)) {
                      this.$el.find('.no-of-spokes-radio').hide();
                 }
           };
           return this;
        },


        createGlobalSettingsGrid : function(){
            this.data0 = {"id":"1",
                         "type":this.context.getMessage("ipsec_vpns_global_endpoint"),
                         "external-if-name":this.context.getMessage("ipsec_vpns_global_click_to_configure"),
                         "tunnel-zone":this.context.getMessage("ipsec_vpns_global_click_to_configure"),
                         "protected-zoneinterface":this.context.getMessage("ipsec_vpns_global_click_to_configure"),
                         "ike-group-id":this.context.getMessage("nat_rulegrid_not_applicable"),
                         "certificate":this.context.getMessage("ipsec_vpns_global_click_to_configure")
                        };
            this.data1 = {"id":"1",
                         "type":this.context.getMessage("ipsec_vpns_type_spoke"),
                         "external-if-name":this.context.getMessage("ipsec_vpns_global_click_to_configure"),
                         "tunnel-zone":this.context.getMessage("ipsec_vpns_global_click_to_configure"),
                         "protected-zoneinterface":this.context.getMessage("ipsec_vpns_global_click_to_configure"),
                         "ike-group-id":this.context.getMessage("nat_rulegrid_not_applicable"),
                         "certificate":this.context.getMessage("ipsec_vpns_global_click_to_configure")
                        };
            this.data2 = {"id":"2",
                         "type":this.context.getMessage("ipsec_vpns_global_hub"),
                         "external-if-name":this.context.getMessage("ipsec_vpns_global_click_to_configure"),
                         "tunnel-zone":this.context.getMessage("ipsec_vpns_global_click_to_configure"),
                         "protected-zoneinterface":this.context.getMessage("ipsec_vpns_global_click_to_configure"),
                         "ike-group-id":this.context.getMessage("ipsec_vpns_global_click_to_configure"),
                         "certificate":this.context.getMessage("ipsec_vpns_global_click_to_configure")
                        };

            // Get saved general settings
            this.vpnGeneralSettings = this.model.get("generalsettings");

            // Get modified grid data
            this.gridData = this.model.get("globalsettingsgrid");
            this.gridContainer = this.$el.find('.globalsettingsgrid').empty();
            this.gridConf = new GlobalSettingsGridConf(this.context);
            var self = this;

            //Enable/Disable certificate column
            this.profileId = this.model.get("generalsettings")["profile-id"];
            this.updateGlobalSettingsGrid(self);
       },

       updateGridColumns : function(authMethod,self) {
              var gridConfig = self.gridConf.getValues();
              var generalSettings = self.model.get("generalsettings");


              //Enable Group IKE column only for Auto VPN/AD VPN.
              gridConfig.columns.forEach(function(element) {
                if(element.name === "ike-group-id") {
                   if(!(generalSettings["vpn-type"] === "HUB_N_SPOKE" &&
                          generalSettings["auto-vpn"] && (generalSettings["auto-vpn"] || generalSettings["advpn"]))) {
                                   element["hidden"] = true;
                                   return;
                             }
                     }
              });

              //Hide Certificate column for Preshared Key Profiles
              if(authMethod==="PRESHARED_KEY") {
                 gridConfig.columns.forEach(function(element) {
                    if(element.name==="certificate") {
                       element["hidden"]=true;
                       return;
                    }
                 });
             }

           /* Protected zone column will be hidden if Routing Option is selected as NONE
            *  and MultiProxyId / Traffic Selector is not enabled in general settings page.
            *
            * Even though Routing Option is set to "NO_ROUTING", if MultiProxyId / Traffic Selector is enabled,
            * then Protected-Zone is visible /shown.
            */
             if(this.model.get("routingOptions").toUpperCase()==="NO_ROUTING" &&
                !generalSettings["multi-proxyid-enable"]) {
                gridConfig.columns.forEach(function(element){
                    if(element.index==="protected-zoneinterface") {
                       element["hidden"]=true;
                    }
                });
             }

             this.grid = new GridWidget({
                           container: self.gridContainer,
                           elements: gridConfig,
                           actionEvents: self.actionEvents,
                           cellOverlayViews: self.cellOverlayViews
                        }).build();

                        if (self.vpnGeneralSettings['vpn-type'] === "HUB_N_SPOKE") {
                            if (self.gridData) {
                                // load global settings grid from data store
                                self.grid.addRow(self.gridData[1]);
                                self.grid.addRow(self.gridData[0]);
                            } else {
                                // load global settings grid from default settings
                                self.grid.addRow(self.data1);
                                self.grid.addRow(self.data2);
                            }
                        } else {
                            if (self.gridData) {
                                // load global settings grid from data store
                                self.grid.addRow(self.gridData);
                            } else {
                                // load global settings grid from default settings
                                self.grid.addRow(self.data0);
                            };
              };
         },

         updateGlobalSettingsGrid : function(self) {
                  $.ajax({
                                       url: '/api/juniper/sd/vpn-management/vpn-profiles/'+self.profileId,
                                       type: 'get',
                                       dataType: 'json',
                                       scope: self,
                                       headers: {
                                                 'accept': 'application/vnd.juniper.sd.vpn-management.vpn-profile+json;q=0.01;version=1'

                                             },
                                             success: function(data, status) {
                                                         var authMethod= data['vpn-profile']['phase1-setting']['auth-method'];
                                                         this.scope.updateGridColumns(authMethod,this.scope);
                                                     },
                                                    error: function() {
                                                        var authMethod= data['vpn-profile']['phase1-setting']['auth-method'];
                                                        this.scope.updateGridColumns(authMethod,this.scope);
                                                    },
                        async: false
                 })
            },

        // Add the Tunnel & Route and Global settings to the basic vpn details
        addTunnelRouteGlobalBasicSettings: function() {
            var basicVpnDetails = this.model.get("basicvpndetails");
            var vpnMo =  this.model.get("vpnmo");
            var globalSettings = this.model.get("globalsettings");

            // add the details from the tunnel & route / Global settings to 
            // the basic vpn details

            basicVpnDetails['vpn-basic-details']['vpn-mo'] = vpnMo;
            basicVpnDetails['vpn-basic-details']['global-settings'] = globalSettings;
            
            // Save the basic VPN details back to the space model
            this.model.set("basicvpndetails",basicVpnDetails);
        },

        handleRowDataEdit : function(editRow) {
            var self = this;
            var keyValue = "";
            if(editRow.currentRowData["type"] === "Spoke") {
                keyValue = "ike-group-id";
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

        // Check whether the selected devices support the type of vpn specified

        isFeatureSupported: function() {
            // Get the VPN MO saved from previous page
            var jsonRequestBody = this.model.get("basicvpndetails");
            var jsonRequest = JSON.stringify(jsonRequestBody);
            var results = false;

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/is-feature-supported?ui-session-id='+this.uuid,
                type: 'post',
                dataType: 'json',
                headers: {
                   'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-basic-details+json;version=1;charset=UTF-8',
                   'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.is-feature-supported-response+json;version=1;q=0.01'
                },
                data: jsonRequest,
                success: function(data, status, response) {
                    if (response.responseJSON["is-feature-supported-response"].value === "True")
                        results = true;
                    else
                        results = false;
                },
                error: function(status) {
                    console.log('is feature supported failed');
                    results = false;
                },
                async: false
            });

            return results;
        },

        // Add in the tunnel route settings to the vpn-mo
        // First add unnumbered
        // Todo: add numbered feature

        setTunnelRouteSettings: function(properties) {
           var vpnmo = this.model.get("vpnmo");

           // vpnmo routing type is set to ui configuration interface type to unnumbered, numbered
           vpnmo['tunnel-interface-type'] = properties['interface-type'];
          
           // vpnmo routing type is set to ui configuration routing options to static, ospf, rip, no_routing

           if(vpnmo['multi-proxyid']) {
                vpnmo['routing-type'] = 'NO_ROUTING';
           } else {
                vpnmo['routing-type'] = properties['routing-options'];
           }

           // vpnmo for max-trasnmission-unit

           vpnmo['max-transmission-unit'] = properties['max-transmission-unit'];

           // Only RIP protcol requires max retrans time
           if (properties['routing-options'] === "RIP") {
               vpnmo['max-retrans-time'] = properties['max-retransmission-time'];
           };

           // Only OSPF protocol requires ospf area id
           if (properties['routing-options'] === "OSPF") {
               vpnmo['ospf-area-id'] = properties['area-id'];
           };

           // Set export route flags
           vpnmo['export-static-routes'] = properties['static-routes'];
           vpnmo['export-ospf-routes'] = properties['ospf-routes'];
           vpnmo['export-rip-routes'] = properties['rip-routes'];
           vpnmo['allow-spoke-to-spoke-communication'] = properties['spoke-to-spoke-communication'];

           // Save the tunnel route settings to the vpnmo space model
           this.model.set("vpnmo",vpnmo);
        },

        // set the global settings
        //
        // global-settings: [
        //    {  
        //        "type": "ENDPOINT",
        //        "externalif": "",
        //        "tunnelZone": "",
        //        "protectedResources": "",
        //        "protectedResourcesType": "",
        //        "ikeGroupId": "",
        //        "certificate": "" 
        //    },
        //    {  
        //        "type": "HUB",
        //        "externalif": "",
        //        "tunnelZone": "",
        //        "protectedResources": "",
        //        "protectedResourcesType": "",
        //        "ikeGroupId": "",
        //        "certificate": "" 
        //    }

        setGlobalSettings: function() {
            var vpnGeneralSettings = this.model.get("generalsettings");
            var globalSettingsGrid = this.grid.getAllVisibleRows();
            var cell_default = this.context.getMessage("ipsec_vpns_global_click_to_configure");

            var global_external_if_name = globalSettingsGrid[0]['external-if-name'];
            var global_tunnel_zone = globalSettingsGrid[0]['tunnel-zone'];
            var global_protected_zoneinterface = globalSettingsGrid[0]['protected-zoneinterface'];
            var global_certificate = globalSettingsGrid[0]['certificate'];
            var global_group_ike = globalSettingsGrid[0]['ike-group-id'];

            // Global Settings Array
            var globalSettings = [];

            // Object of Global Settings Array
            var globalSetting = {
                "type": "",
                "external-if": "",
                "tunnel-zone": "",
                "protected-resources": [],
                // backend needs a default protected resources type even if protected resources not clicked on
                "protected-resource-type": "ZONES",
                "ike-group-id": "",
                "certificate": "" 
            };

            // Endpoint is normally row 0 of global setting grid
            var endpointGridRowIndex = 0;

            // Hub and Spoke endpoint moves to row 1 and hub is row 0 in global settings grid
            if (vpnGeneralSettings['vpn-type'] === "HUB_N_SPOKE")
                endpointGridRowIndex = 1;

            // First set endpoint global settings
            // Set global settings value if user clicked on and changed cell in grid

            // Set the type to ENDPOINT or HUB
            globalSetting.type = "ENDPOINT";

            // Set the external-if
            if (global_external_if_name != cell_default)
                globalSetting['external-if'] = globalSettingsGrid[endpointGridRowIndex]['external-if-name'][0];

            // Set the tunnel-zone
            if (global_tunnel_zone != cell_default && global_tunnel_zone != "")
                globalSetting['tunnel-zone'] = globalSettingsGrid[endpointGridRowIndex]['tunnel-zone'][0];

            // Set the protected resources
            if (global_protected_zoneinterface != cell_default) {
                // Protected Networks data comes from space model instead of grid
                var protectedResource = this.model.get("globalSettingsProtectedEndpoint");

                // Set the protected-resource-type
                if (protectedResource) {
                    globalSetting['protected-resources'] = protectedResource.cellData;
                    globalSetting['protected-resource-type'] = protectedResource.dataType;
                };
            };

            // Set the certificate
            if (global_certificate != cell_default)
                globalSetting['certificate'] = globalSettingsGrid[endpointGridRowIndex]['certificate'][0];


            // Add Endpoint to the global settings array
            globalSettings.push(globalSetting);


            // Is this VPN an hub and spoke then set hub global settings only if hub and spoke
            if (vpnGeneralSettings['vpn-type'] === "HUB_N_SPOKE") {
                // the Hub is in global settings grid at row 0 so read cell values from row 0
                endpointGridRowIndex = 0;

                globalSetting = {
                    "type": "",
                    "external-if": "",
                    "tunnel-zone": "",
                    "protected-resources": [],
                    // backend needs a default protected resources type even if protected resources not clicked on
                    "protected-resource-type": "ZONES",
                    "ike-group-id": "",
                    "certificate": ""
                }

                globalSetting.type = "HUB";

                // Set the external-if
                if (global_external_if_name != cell_default)
                globalSetting['external-if'] = globalSettingsGrid[endpointGridRowIndex]['external-if-name'][0];

                // Set the tunnel-zone
                if (global_tunnel_zone != cell_default && global_tunnel_zone != "")
                    globalSetting['tunnel-zone'] = globalSettingsGrid[endpointGridRowIndex]['tunnel-zone'][0];

                // Set the protected resources
                if (global_protected_zoneinterface != cell_default) {
                    var protectedResource = this.model.get("globalSettingsProtectedHub");

                    // Set the protected-resources
                    globalSetting['protected-resources'] = protectedResource.cellData;
                    globalSetting['protected-resource-type'] = protectedResource.dataType;
                };

                // Set the certificate
                if (global_certificate != cell_default)
                    globalSetting['certificate'] = globalSettingsGrid[endpointGridRowIndex]['certificate'][0];

                if (global_group_ike != cell_default && global_group_ike != 'Not Applicable')
                    globalSetting['ike-group-id'] = this.model.get("globalSettingsGroupIke").apiData;

                // Add Hub to the global settings array
                globalSettings.push(globalSetting);
            };

            // Save the global settings in the space model
            this.model.set("globalsettings",globalSettings);
        },

        // Sets the number of Spokes in the vpnmo for numbered tunnel settings
        setNumberOfSpokes: function(properties) {
            var vpnmo = this.model.get("vpnmo");
            if (properties['no-of-spokes'] === "ALL") {
                vpnmo['tunnel-multi-point-size'] = -1;
                return;
            } else if (properties["interface-type"] === "UNNUMBERED" && properties["no-of-spokes"] === "SPECIFY_VALUE") {
                vpnmo['tunnel-multi-point-size'] = -1;
                return;
            }
            vpnmo['tunnel-multi-point-size'] = properties['no-of-spokes-value'];
        },

        // Numbered setting so add the IP address and subnet mask to the basicVpnSettings
        //                       "tunnel-interface-type": tunnel_interface_type,
        //
        //                        "tunnel-ip-range": {
        //                            "mask": "",
        //                            "network-ip":""
        //                        }
        setIP: function() {
            var basicVpnDetails = this.model.get("basicvpndetails");

            basicVpnDetails['vpn-basic-details']['vpn-mo']['tunnel-interface-type']= "NUMBERED";
            basicVpnDetails['vpn-basic-details']['vpn-mo']['tunnel-ip-range']['network-ip'] = this.$el.find('#network-ip-address').val();
            basicVpnDetails['vpn-basic-details']['vpn-mo']['tunnel-ip-range']['mask'] = this.$el.find('#network-ip-cidr').val();

            // Save this back tot he basic vpn model
            this.model.set("basicvpndetails",basicVpnDetails);
        },

        // For tunnel type that is numbered, validate tunnel settings
        validateTunnelSettings: function() {
            // Get the VPN MO saved from previous page
            var jsonRequestBody = this.model.get("basicvpndetails");
            var numberOfSpokes = Syphon.serialize(this)['no-of-spokes-value'];
            if((numberOfSpokes != undefined) && (numberOfSpokes != "")) {
                jsonRequestBody["vpn-basic-details"]["vpn-mo"]["tunnel-multi-point-size"] = numberOfSpokes;
            } else {
                jsonRequestBody["vpn-basic-details"]["vpn-mo"]["tunnel-multi-point-size"] = -1;
            }
            var jsonRequest = JSON.stringify(jsonRequestBody);
            var results = false;

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/validate-tunnel-settings?ui-session-id=' + this.uuid,
                type: 'post',
                dataType: 'json',
                headers: {
                   'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.vpn-basic-details+json;version=1;charset=UTF-8',
                   'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.validate-tunnel-settings+json;version=1;q=0.01'
                },
                data: jsonRequest,
                success: function(data, status, response) {
                    if (response.responseJSON["validate-tunnel-settings-response"]["validation-result"].length === 0)
                        results = true;
                    else
                        results = response.responseJSON["validate-tunnel-settings-response"]["validation-result"][0];
                },
                error: function(status) {
                    console.log('tunnel not validated');
                    results = false;
                },
                async: false
            });
            return results;
        },

        // cache device endpoints json request body

        cacheDeviceEndpointsRequest: function() {
            var jsonRequestBody = {};
            var requestBody = {};

            var vpnmo = this.model.get("vpnmo");
            var globalSettings = this.model.get("globalsettings");

            requestBody = {
                "cache-endpoint-details":{
                    "vpn-mo": vpnmo,
                    "global-settings": globalSettings,
                    "is-create-flow": "true"
                }
            };

            jsonRequestBody = JSON.stringify(requestBody);
            return jsonRequestBody;
        },

        // Cache the device endpoints
        //
        // request body
        // {
        //   cache-endpoint-details: {
        //       "vpn-mo": {},
        //       "global-settings": {},
        //       "is-create-flow": "true"
        //   }
        // }

        cacheDeviceEndpoints: function() {
            var cacheDeviceEndpointsRequest = this.cacheDeviceEndpointsRequest();
            var results = false;

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/cache-endpoint-details?ui-session-id='+this.uuid,
                type: 'post',
                dataType: 'json',
                headers: {
                   'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.cache-endpoint-details+json;version=1;charset=UTF-8',
                   'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.cache-endpoint-details+json;version=1;q=0.01'
                },
                data: cacheDeviceEndpointsRequest,
                success: function(data, status, response) {
                    results = true;
                },
                error: function(status) {
                    console.log('unable to cache device endpoints');
                    results = false;
                },
                async: false
            });
            return results;
        },


        /**
         * Return the page title for the wizard.
         * 
         * returns String, the page title
         */
        getTitle: function() {
            return this.context.getMessage('vpn_trg_settings_form_title');
        },

        /**
         * Returns the page summary for the wizard.
         * 
         * returns Array, containing input summary
         */
        getSummary: function() {
            var summary = [];
            var userData = Syphon.serialize(this);
            var vpnnameLabel = this.context.getMessage('vpn_wizard_tunnel_and_route_settings_page_train_title');
            var interfaceType = "";
            var routingOptions  = "";
            var spokeToSpoke = "";

            var vpnGeneralSettings = this.model.get("generalsettings");

            if (userData["routing-options"] == "OSPF")
                routingOptions = this.context.getMessage('vpn_wizard_ospf');
            if (userData["routing-options"] == "STATIC")
                routingOptions = this.context.getMessage('vpn_wizard_static');
            if (userData["routing-options"] == "RIP")
                routingOptions = this.context.getMessage('vpn_wizard_rip');
            if (userData["routing-options"] == "NO_ROUTING")
                routingOptions = this.context.getMessage('vpn_wizard_none');


            if (userData["spoke-to-spoke"] == this.context.getMessage('vpn_wizard_allow'))
               spokeToSpoke = this.context.getMessage('vpn_wizard_ospf');
            if (userData["routing-options"] == this.context.getMessage('vpn_wizard_not_allow'))
               spokeToSpoke = this.context.getMessage('vpn_wizard_not_allow');

            if(vpnGeneralSettings["tunnel-mode"] != "POLICY_BASED") {
                summary.push({
                  'label': vpnnameLabel,
                  'value': '&nbsp;'
                });

                summary.push({
                   'label': this.context.getMessage('vpn_wizard_routing_options'),
                   'value': routingOptions
                });

                summary.push({
                   'label': this.context.getMessage('vpn_wizard_spoke_to_spoke'),
                   'value': spokeToSpoke
                });
            }
            return summary;
        },

        /**
         * Handles back and next button clicks on the wizard.
         * 
         * returns Boolean, false if form validation fails else true to let wizard navigate pages
         */
         beforePageChange: function(currentPage, nextPage) {
            var self = this;
            self.nextPage = nextPage;
            this.grid.removeEditModeOnRow();

            if(self.isReadyForNextPage)
                   return true;

            // Save properties to model for use in a different page
            var vpnGeneralSettings = this.model.get("generalsettings");
            var globalSettingsGrid = this.grid.getAllVisibleRows();
            var properties = Syphon.serialize(this);
            var jsonDataObj = {
                "interface-type": properties["interface-type"],
                "network-ip-address": properties['network-ip-address'],
                "network-ip-cidr": properties['network-ip-cidr'],
                "network-ip-subnet-mask": properties['network-ip-subnet-mask'],
                "no-of-spokes": properties["no-of-spokes"],
                "no-of-spokes-value": properties["no-of-spokes-value"],
                "routing-options": properties["routing-options"],
                "export-routes": properties["export-routes"],
                "area-id": properties["area-id"],
                "max-retransmission-time": properties["max-retransmission-time"],
                "spoke-to-spoke-communication": properties["spoke-to-spoke-communication"],
                "global-settings-grid": properties["global-settings-grid"]
            };
            var validate = false;
            var results = false;

            // Save properties to model for use later
            this.model.set("globalsettingsproperties",jsonDataObj);

            // Save buttons that where pressed for next pages back button
            var jsonDataButtonObj = {
                "unnumbered": this.$el.find('#interface-type-unnumbered-id').prop('checked'),
                "numbered": this.$el.find('#interface-type-numbered-id').prop('checked'),

                "no-of-spokes-all": this.$el.find('#no-of-spokes-all-id').prop('checked'),
                "no-of-spokes": this.$el.find('#no-of-spokes-id').prop('checked'),

                "static": this.$el.find('#routing-options-static-id').prop('checked'),
                "ospf": this.$el.find('#routing-options-ospf-id').prop('checked'),
                "rip": this.$el.find('#routing-options-rip-id').prop('checked'),
                "none": this.$el.find('#routing-options-none-id').prop('checked'),

                "static-routes": this.$el.find('#static-routes').prop('checked'),
                "rip-routes": this.$el.find('#rip-routes').prop('checked'),
                "ospf-routes": this.$el.find('#ospf-routes').prop('checked'),
                
                "spoke-to-spoke-communication": this.$el.find('#spoke-to-spoke-communication').prop('checked')
            };
            if (typeof(jsonDataButtonObj["static-routes"]) === "undefined")
                jsonDataButtonObj["static-routes"] = false;
            if (typeof(jsonDataButtonObj["ospf-routes"]) === "undefined")
                jsonDataButtonObj["ospf-routes"] = false;
            if (typeof(jsonDataButtonObj["rip-routes"]) === "undefined")
                jsonDataButtonObj["rip-routes"] = false;
            this.model.set("globalsettingsbuttons", jsonDataButtonObj);

            // Save the global settings grid for back button to work
            this.model.set("globalsettingsgrid", globalSettingsGrid);

            this.model.set("no-of-spokes", properties['no-of-spokes']);
            this.model.set("area-id", properties['area-id']);
            this.model.set("max-retransmission-time", properties['max-restransmission-time']);
            this.model.set("network-ip-address", properties['network-ip-address']);
            this.model.set("network-ip-cidr", properties['network-ip-cidr']);
            this.model.set("network-ip-subnet-mask", properties['network-ip-subnet-mask']);
            // syphon does not have properites of checkboxes so get checkbox from press jsondatabuttonobj
            this.model.set("ospf-routes", jsonDataButtonObj['ospf-routes']);
            this.model.set("rip-routes", jsonDataButtonObj['rip-routes']);
            this.model.set("static-routes", jsonDataButtonObj['static-routes']);

            // add check box to properties passed to set tunnel route settings
            properties["static-routes"] = jsonDataButtonObj['static-routes'];
            properties["ospf-routes"] = jsonDataButtonObj['ospf-routes'];
            properties["rip-routes"] = jsonDataButtonObj['rip-routes'];

            // Set Tunnel & Route settings
            this.setTunnelRouteSettings(properties);

            // Set Global settings
            this.setGlobalSettings();

            // Add Tunnel & Route & Global settings to basicVpnDetails
            this.addTunnelRouteGlobalBasicSettings();
                
            // if type is numbered,
            //   1) Add the ip address and subnet to basicVpnDetails
            //   2) Add number of spokes
            //   3) validate tunnel settings

            if (properties["interface-type"] === "NUMBERED") {
                           if (!this.formWidget.isValidInput()) {
                                     console.log('form is invalid');
                                     return false;
                                }
                           };
            if (properties["interface-type"] === "NUMBERED") {
                         if(properties["network-ip-cidr"] == ""){
                              this.formWidget.showFormError(this.context.getMessage('vpn_trg_settings_specify_mask'));
                                     return false;
                                }
                            };


             if (properties["interface-type"] === "NUMBERED" && properties["no-of-spokes"] === "SPECIFY_VALUE") {
                if(properties["no-of-spokes-value"] == "") {
                this.formWidget.showFormError(this.context.getMessage('vpn_trg_settings_specify_value'));
                    return false;
                }
            };

              if (properties["routing-options"] === "OSPF") {
                             if(properties["area-id"] == ""){
                             this.formWidget.showFormError(this.context.getMessage('vpn_trg_settings_OSPF_value'));
                                  return false;
                               }
                         };



            if (properties["interface-type"] === "NUMBERED") {
                this.setIP();

                validate = this.validateTunnelSettings();
                if (validate != true || validate === "true") {
                    this.formWidget.showFormError(validate.field+': '+validate.error);
                    return false;
                }
            };

            this.setNumberOfSpokes(properties);

            // Validate whether the selected devices support the type of vpn specified
             
            var validateFeature;

            validateFeature = this.isFeatureSupported();

            if (validateFeature === "false") {
                console.log('validate feature failed');
                return false;
            };

            // Send the Device Endpoints to the Backend Cache

            results = this.cacheDeviceEndpoints();
            if (results === false) {
                console.log('failed to cache device endpoints');
                return false;
            };

            return true;
        },

        sleep: function(milliSeconds) {
            var startTime = new Date().getTime();
            while (new Date().getTime() < startTime + milliSeconds);
        },

        // Page View event handlers

        /**
         * Handles clicks on interface-type radio selection, shows/hides related UI elements.
         * @param {Object} e - event object
         */
        onClickInterfaceType: function(e) {
            var vpnGeneralSettings = this.model.get("generalsettings");
            if (e.currentTarget.value == 'NUMBERED') {
                this.$el.find('.numbered').show();
                if(vpnGeneralSettings['vpn-type'] === "HUB_N_SPOKE") {
                    this.$el.find('.no-of-spokes-radio').show();
                    this.$el.find('.no-of-spokes-value').show();
                    this.$el.find("input[value='ALL']:checked").click();
                } else {
                    this.$el.find('.no-of-spokes-radio').hide();
                    this.$el.find('.no-of-spokes-value').hide();
                }
         //       this.$el.find("input[value='ALL']:checked").click();
            } else {
                this.$el.find('.numbered').hide();
            }
        },

        /**
         * Handles clicks on routing-options radio selection, shows/hides related UI elements.
         * @param {Object} e - event object
         */
        onClickRoutingOptions: function(e) {
            switch (e.currentTarget.value) {
                case 'STATIC':
                    this.$el.find('.area-id').hide();
                    this.$el.find('.max-retransmission-time').hide();
                    this.$el.find('.export-routes-checkboxes input:checked').removeAttr('checked');
                    this.$el.find('.export-routes-checkboxes').hide();
                    this.showHideSpokeToSpokeOption();
                    this.model.set("routingOptions","STATIC");
                    this.hideProtectedZoneInterfaceColumn(false);
                    break;
                case 'OSPF':
                    this.$el.find('.area-id').show();
                    this.$el.find('.max-retransmission-time').hide();
                    this.$el.find('.export-routes-checkboxes').show();
                    //this.$el.find('#ospf-routes').parent().hide();
                    this.$el.find('input[value="OSPF_ROUTES"]').parent().hide();
                    //this.$el.find('#rip-routes').parent().show();
                    this.$el.find('input[value="RIP_ROUTES"]').parent().show();
                    this.$el.find('.allow-spoke-to-spoke-communication').hide();
                    this.model.set("routingOptions","OSPF");
                    this.hideProtectedZoneInterfaceColumn(false);
                    break;
                case 'RIP':
                    this.$el.find('.area-id').hide();
                    this.$el.find('.max-retransmission-time').show();
                    this.$el.find('.export-routes-checkboxes').show();
                    //this.$el.find('#ospf-routes').parent().show();
                    this.$el.find('input[value="OSPF_ROUTES"]').parent().show();
                    //this.$el.find('#rip-routes').parent().hide();
                    this.$el.find('input[value="RIP_ROUTES"]').parent().hide();
                    this.$el.find('.allow-spoke-to-spoke-communication').hide();
                    this.model.set("routingOptions","RIP");
                    this.hideProtectedZoneInterfaceColumn(false);
                    break;
                case 'NO_ROUTING':
                    this.$el.find('.area-id').hide();
                    this.$el.find('.max-retransmission-time').hide();
                    this.$el.find('.export-routes-checkboxes').hide();
                    this.$el.find('.allow-spoke-to-spoke-communication').hide();
                    this.model.set("routingOptions","NO_ROUTING");
                    this.hideProtectedZoneInterfaceColumn(true);
                    break;
            }

        },

        /* Protected zone column will be hidden / shown based on selection of Routing Option
        *  and MultiProxyId / Traffic Selector is not enabled in general settings page.
        */
        hideProtectedZoneInterfaceColumn : function(hide) {
            if(hide && !this.model.get('generalsettings')["multi-proxyid-enable"])
                $("#global-settings-grid-id").hideCol("protected-zoneinterface");
            else
                $("#global-settings-grid-id").showCol("protected-zoneinterface");
            $("#global-settings-grid-id").trigger("resize");
        },

        /*
         *Show Spoke-to-Spoke option only for Hub n Spoke vpn
        */
        showHideSpokeToSpokeOption : function() {
            var vpnGeneralSettings = this.model.get("generalsettings");
            (vpnGeneralSettings['vpn-type'] === "HUB_N_SPOKE")?
                                       this.$el.find('.allow-spoke-to-spoke-communication').show() :
                                       this.$el.find('.allow-spoke-to-spoke-communication').hide();
        },

        /**
         * Handles clicks on no-of-spokes radio selection, shows/hides related UI elements.
         * @param {Object} options - The options containing the Slipstream's context
         */
        onClickNoOfSpokes: function(e) {
            if (e.currentTarget.value == 'ALL') {
                this.$el.find('.no-of-spokes-value').hide();
            } else {
                this.$el.find('.no-of-spokes-value').show();
            }
        }
    });

    return VpnTunnelRouteGlobalSettingsPageView;
}); 
