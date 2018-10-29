/**
 * Module that implements the VpnEndpointsPageView.
 *
 * @module VpnEndpointsPageView
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */


define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../widgets/vpnDevicesListBuilder.js',
    '../conf/vpnEndpointsConfig.js',
    '../models/deviceCollection.js',
    'widgets/spinner/spinnerWidget'
], function ($, _, Backbone, Syphon, FormWidget, VpnDevicesListBuilder, VpnEndpointsConfig, DeviceCollection, SpinnerWidget) {

    var TYPE_VALUE_DEVICES = "Juniper",
        TYPE_VALUE_EXTRANET = "Extranet",
        HUB_N_SPOKE = "HUB_N_SPOKE",
        SITE_TO_SITE = "SITE_TO_SITE",
        FULL_MESH = "FULL_MESH";

    var VpnEndpointsPageView = Backbone.View.extend({

        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.context;
            this.uuid = options.uuid;
            this.collection = new DeviceCollection();
        },

        submit: function(event) {
            event.preventDefault();
            // Check is form valid
            if (! this.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }
            
            console.log('ready to save');

            this.activity.overlay.destroy();
        },

        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },


        // This routine returns the VpnMo information

        getVpnMo: function () {
            var device_is_hub = "false",
                device_extranet_device = "",
                device_external_if_name = "",
                device_moid = "",
                device_name = "",
                device_proxy_id = "",
                device_protected_zone = "",
                device_tunnel_zone = "",
                device_tunnel_vr = "",
                general_advpn = "false",
                general_auto_vpn = "false",
                general_description = "",
                general_idle_threshold = 3,
                general_idle_time = 60, 
                general_manual = "",
                general_name = "",
                general_preshared_key_type = "AUTO_GENERATE",
                general_profile_id = "",
                general_profile_name = "MainModeProfile",
                general_multi_proxyid_enable = "false",
                general_shortcut_connection_limit = -1,
                general_idle_threshold = -1;
                general_idle_time = -1;
                general_type = "SITE_TO_SITE",
                general_tunnel_mode_types = "ROUTE_BASED",
                general_unique_key_per_tunnel = "true",
                general_unmask = "",
                max_retrans_time = "50",
                max_transmission_unit = "-1",
                ospf_area_id = "0",
                routing_type = "STATIC",
                tunnel_multi_point_size = "-1",
                tunnel_interface_type = "UNNUMBERED";
            var jsonRequest = {};
            var vpnMo = {};

            // Get general settings that were saved from first page of wizard
            var generalSettings = this.model.get("generalsettings");

            // Get user input from general settings wizard page
            general_name = generalSettings['name'];
            general_description = generalSettings['description'];
            general_tunnel_mode_types = generalSettings['tunnel-mode'];
            general_multi_proxyid_enable = generalSettings['multi-proxyid-enable'];
            general_type = generalSettings['vpn-type'];

            if (generalSettings['auto-vpn'])
                general_auto_vpn = "true"
            else
                general_auto_vpn = "false";

            if (generalSettings['advpn'])
                general_advpn = "true"
            else
                general_advpn = "false";
            general_shortcut_connection_limit = generalSettings['shortcut-conn-limit'];
            general_idle_threshold = generalSettings['idle-threshold'];
            general_idle_time = generalSettings['idle-time'];
            general_preshared_key_type = generalSettings['preshared-key-button'];
            general_unique_key_per_tunnel = generalSettings['generate-unique-key'];
            general_manual = generalSettings['manual'];
            general_unmask = generalSettings['unmask'];
            general_profile_name = generalSettings['profile.name'];
            general_profile_id = generalSettings['profile-id'];

            vpnMo = {
                        "name": general_name,
                        "description": general_description,
                        "profile": {
                            "id": general_profile_id,
                            "moid": "net.juniper.space.sd.vpnmanager.jpa.IPSecVPNProfileEntity:" + general_profile_id,
                            "name": general_profile_name
                        },
                        "vpn-tunnel-mode-types": general_tunnel_mode_types,
                        "type": general_type,
                        "tunnel-interface-type": tunnel_interface_type,
                        "tunnel-ip-range": {
                            "mask": "",
                            "network-ip":""
                        },
                        "routing-type": routing_type,
                        "preshared-key-type": general_preshared_key_type,
                        "preshared-key": general_manual,
                        "unique-key-per-tunnel": general_unique_key_per_tunnel,
                        "auto-vpn": general_auto_vpn,
                        "advpn": general_advpn,
                        "advpn-settings": {
                            "shortcut-conn-limit": general_shortcut_connection_limit,
                            "idle-threshold": general_idle_threshold,
                            "idle-time": general_idle_time
                        },
                        "multi-proxyid": general_multi_proxyid_enable,
                        "max-transmission-unit": max_transmission_unit,
                        "tunnel-multi-point-size": tunnel_multi_point_size,
                        "max-retrans-time": max_retrans_time
            };

            return vpnMo;
        },

        // This routine returns the query params where user has not yet
        // selected devices or selected extranets.
        // Note that reset-store field is true which means to load data store
        // During the endpoint settings page, an api call to move the datastore to cache
        // will be done.

        getEmptyQueryParams: function (fetchType) {
            var requestBody = {};
            requestBody = {
                        "fetch-type": fetchType,
                        "reset-store": "true",
                        "selected-devices": {},
                        "extranet-devices": {}
            };

            return requestBody;
        },

        // This routine returns the basic vpn details
        getVpnBasicDetails: function() {
            var requestBody = {};
            requestBody = {
                "vpn-basic-details": {
                    "vpn-mo": this.getVpnMo()
                }
            };
            return requestBody;
        },

        // This routine will fill the selected-devices with devices
        // that the user selected from the listbuilder.
        // Note that the reset-store field is now false
        //
        // The selected-devices parameter is now in the format below:
        //
        // "query-params": {
        // "fetch-type": "Devices",
        // "reset-store": "false",
        // "selected-devices": { "device-ids": [
        //   {"id":"229376","type":"H"},
        //   {"id":"229382","type":"E"},
        //   {"id":"229390","type":"E"}
        //   ]
        //  },
        //  "extranet-devices": { "extranet-ids": []}
        // }

        setAvailableQueryParams: function() {
            var generalSettings = this.model.get("generalsettings"),
                vptType = generalSettings['vpn-type'],
                selectedHubs = this.model.get("selectedHubDeviceIds"),
                selectedEndpoints = this.model.get("selectedEndpointDeviceIds"),
                requestBody = {},
                deviceList=[],
                extranetList=[];

            if (vptType === HUB_N_SPOKE) {
                selectedHubs.forEach(function(object){
                    if (object["is-extranet"]){
                        extranetList.push({
                           "id":object.id,
                           "type":"H",
                           "name":object.name,
                           "display-name":object["display-name"],
                           "device-ip":object["device-ip"]
                        });
                    }else{
                        deviceList.push({
                            "id": object.id,
                            "type":"H",
                            "name":object.name,
                            "display-name":object["display-name"],
                            "device-ip":object["device-ip"]
                        });
                    }

                });
             }

             // Add endpoints
             selectedEndpoints.forEach(function(object) {
                    if (object["is-extranet"]){
                        extranetList.push({
                           "id":object.id,
                           "type":"E",
                           "name":object.name,
                           "display-name":object["display-name"],
                           "device-ip":object["device-ip"]
                        });
                    }else{
                        deviceList.push({
                            "id": object.id,
                            "type":"E",
                            "name":object.name,
                            "display-name":object["display-name"],
                            "device-ip":object["device-ip"]
                        });
                    }
              });

            requestBody = {
                "fetch-type": "Devices",
                "reset-store": "false",
                "selected-devices": {"device-ids":deviceList},
                "extranet-devices": {"extranet-ids":extranetList}
            };
            return requestBody;
        },
        // This routine returns selected devices request body
        getSelectedDevicesRequestBody: function() {
            var requestBody = {};
            requestBody = {
                "available-devices": {
                    "vpn-mo": this.getVpnMo(),
                    "query-params": this.setAvailableQueryParams()
                }    
            };
            return requestBody;
        },

        // This routine returns the json selected devices request body 
        getSelectedDevicesRequestBodyJson: function() {
            var requestBody = {};
            var jsonRequest = {};

            requestBody = this.getSelectedDevicesRequestBody();
            jsonRequest = JSON.stringify(requestBody);
            return jsonRequest;
        },


        // This routine makes rest call to tell data store which devices
        // have been selected

        setSelectedDevices: function() {
            var self = this;
            var results = false;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/available-devices?ui-session-id='+this.uuid,
                type: 'post',
                headers: {
                    'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.available-devices+json;version=1;charset=UTF-8',
                    'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.devices+json;version=1;q=0.01'
                },
                dataType: 'json',
                data: self.getSelectedDevicesRequestBodyJson(),
                success: function (data, status, options) {
                    self.cacheDeviceDetails();
                    results = true;
                },
                error: function (status) {
                    results = false;
                    console.log('unable to move selected devices to backend data store');
                    self.destroySpinner();
                },
           //     async: false
            });
            return results;
        },

        // This routine returns the request body for available-devices

        getAvailableDevices: function(fetchType) {
            var requestBody = {};
            requestBody = {
                "available-devices": {
                    "vpn-mo": this.getVpnMo(),
                    "query-params": this.getEmptyQueryParams(fetchType)
                }    
            };
            return requestBody;
        },

        // This routine returns the json request body for the
        // getAvailableDevices cache REST call using general settings

        getAvailableDevicesRequestBody: function(fetchType) {
            var requestBody = {};
            requestBody = this.getAvailableDevices(fetchType);
            jsonRequest = JSON.stringify(requestBody);
            return jsonRequest;
        },

        // This routine creates the cache device details json request 
        cacheDeviceDetailsRequest: function() {
            var jsonRequestBody = {};
            var requestBody = {};
            // Get general settings that were saved from first page of wizard
            var generalSettings = this.model.get("generalsettings");

            general_profile_id = generalSettings['profile-id'];

            requestBody = {
                "cache-device-details":{
                   "vpn-profile-moid": "net.juniper.space.sd.vpnmanager.jpa.IPSecVPNProfileEntity:" + general_profile_id,
                   "is-create-flow": "true"
                }
            };

            jsonRequestBody = JSON.stringify(requestBody);
            return jsonRequestBody;
        },

        // This routine makes backend REST call to cache the selected devices data store to the backend
        cacheDeviceDetails: function() {
            var results = false;
            var self = this;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/cache-device-details?ui-session-id='+this.uuid,
                type: 'post',
                headers: {
                    'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.cache-device-details+json;version=1;charset=UTF-8',
                    'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.cache-device-details+json;version=1;q=0.01'
                },
                dataType: 'json',
                data: self.cacheDeviceDetailsRequest(),
                success: function (data, status, options) {

                    //Validate duplicate selected device or at least one juniper device is selected
                    self.validateDeviceSelection();
                    results = true;
                },
                error: function(status) {
                    results = false;
                    console.log('failed to cache device details');
                    self.destroySpinner();
                }

           //     async: false
            });
            return results;
        },

        validateDeviceSelection: function(){
            var self = this;
            var results = false;

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/validate-device-selection?ui-session-id='+this.uuid,
                type: 'get',
                headers: {
                    'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.validation-response+json;version=1;q=0.01'
                },
                dataType: 'json',
                success: function (data, status, options) {
                    results = data["validation-response"]["is-valid"];
                    self.isReadyForNextPage = true;
                    if(self.nextPage == 0) {
                        self.options.wizardView.wizard.gotoPage(0);
                    }  else {
                        self.options.wizardView.wizard.nextPage();
                    }
                    self.destroySpinner();
                },
                error: function(status) {
                    console.log('device selection validation failed');
                    self.destroySpinner();
                }
            //    async: false
            });
            return results;
        },

        render: function() {
            var self = this;

            self.isReadyForNextPage = false;

            this.context.vpnType = this.model.attributes.generalsettings['vpn-type'];
            this.context.vpnDeviceType = 'end-point';
            var vpnEndpointsConfig = new VpnEndpointsConfig(this.context);

            this.form = new FormWidget({
                container: this.el,
                elements: vpnEndpointsConfig.getValues()
            });
            this.form.build();

            this.buildEndpointsListBuilder();
            
            return this;
        },

        displaySpinner: function(container, message){
            this.spinner = new SpinnerWidget({
                                "container": container,
                                "statusText": message
                            }).build();
            return this.spinner;
            self.options.wizardView.wizard.showMask(this.spinner);
        },

        destroySpinner:function(spinner){
            this.spinner.destroy();
        },

        getTitle: function () {
          return this.context.getMessage('vpn_wizard_endpoint_page_title');
        },

        buildEndpointsListBuilder: function(){
            var self = this,
                selectedItems = [],
                endpointListContainer = this.$el.find('#endpoint'),
                vpnGeneralSettings = self.model.get("generalsettings");

                self.displaySpinner(self.el, self.context.getMessage("Waiting_status_text"));

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/available-devices?ui-session-id='+this.uuid,
                type: 'post',
                headers: {
                    'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.available-devices+json;version=1;charset=UTF-8',
                    'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.devices+json;version=1;q=0.01'
                },
                dataType: 'json',
                data: this.getAvailableDevicesRequestBody("Devices"),
                success: function (data, status, options) {

                    self.destroySpinner();

                    if (self.model.get("selectedEndpointDeviceIds")) {
                        var selectedDevices = self.model.get("selectedEndpointDeviceIds");
                        selectedItems = selectedDevices.map(function(item) {
                            return item.id;
                        });
                    }
                    self.endpointListBuilder = new VpnDevicesListBuilder({
                        context: self.context,
                        container: endpointListContainer,
                        selectedItems: selectedItems,
                        queries: self.generateQueryPara(),
                        id: "vpn-endpoint-list"
                    });

                    self.endpointListBuilder.build(function() {
                       var endItems = endpointListContainer.find('#slipstream_list_builder_widget_vpn-endpoint-list');
                        endItems.unwrap();
                        $(endItems).on('onChangeSelected', function () {
                            if (vpnGeneralSettings['vpn-type'] === "HUB_N_SPOKE"){
                                self.hubListBuilder._listBuilder.reload();
                            }
                        });
                        if (vpnGeneralSettings['vpn-type'] === "HUB_N_SPOKE"){
                            self.buildHubListBuilder();
                            self.updatedConf();
                        }                        
                    },false);


                    self.$el.find("input[type=radio][name=vpn-endpoint-selection-filter]").click(function (){
                        if (this.value === TYPE_VALUE_DEVICES) {
                            self.endpointListBuilder.filterByTypes(TYPE_VALUE_DEVICES);
                        } else if (this.value === TYPE_VALUE_EXTRANET) {
                            self.endpointListBuilder.filterByTypes(TYPE_VALUE_EXTRANET);
                        }
                    });
                },
//                async: false,
                error: function (collection, response, options) {
                    console.log('collection not fetched');
                    self.destroySpinner();
                }
            });

        },
        buildHubListBuilder: function(){
            var self = this,
                selectedItems = [],
                hubListContainer = this.$el.find('#hub');

            if (this.model.get("selectedHubDeviceIds")) {
                var selectedDevices = this.model.get("selectedHubDeviceIds");
                selectedItems = selectedDevices.map(function(item) {
                    return item.id;
                });
            }

            hubListContainer.parents('.list-builder').removeClass('hide').prev().removeClass('hide');
            self.context.vpnDeviceType = 'hub';
            self.hubListBuilder = new VpnDevicesListBuilder({
                context: self.context,
                container: hubListContainer,
                selectedItems: selectedItems,
                queries: self.generateQueryPara(),
                id: "vpn-hub-list"
            });

            self.hubListBuilder.build(function() {
                var hubitem = hubListContainer.find('#slipstream_list_builder_widget_vpn-hub-list');
                hubitem.unwrap();
              // reload page whenever next/ back button is triggered.
                if (self.context['vpnType'] === "HUB_N_SPOKE"){
                     self.endpointListBuilder._listBuilder.reload();
                }  
                $(hubitem).on('onChangeSelected', function () {
                    self.endpointListBuilder._listBuilder.reload();
                });
            },true);

            this.$el.find("input[type=radio][name=vpn-hub-selection-filter]").click(function (){
                if (this.value === TYPE_VALUE_DEVICES) {
                    self.hubListBuilder.filterByTypes(TYPE_VALUE_DEVICES);
                } else if (this.value === TYPE_VALUE_EXTRANET) {
                    self.hubListBuilder.filterByTypes(TYPE_VALUE_EXTRANET);
                }
            });  
        },
        updatedConf: function(){
            var self = this;
          var vpnGeneralSettings = this.model.get("generalsettings");
            if (vpnGeneralSettings['vpn-type'] == "HUB_N_SPOKE") {
                if( vpnGeneralSettings['auto-vpn']||vpnGeneralSettings['advpn']){
                    self.$el.find('#vpn-hub-extranet').hide();
                    self.$el.find('#vpn-hub-extranet').closest('.elementinput').hide();
                    self.$el.find('#vpn-endpoint-extranet').hide();
                    self.$el.find('#vpn-endpoint-extranet').closest('.elementinput').hide();
                }
            }

        },

        generateQueryPara: function(){
            var vpnGeneralSettings = this.model.get("generalsettings"),
                queries = {
                'tunnelMode': vpnGeneralSettings['tunnel-mode'],
                'deviceType': 'Juniper'
            }; 
            if (vpnGeneralSettings['auto-vpn']) queries['autoVPN'] = true;
            if (vpnGeneralSettings['multi-proxyid-enable']) queries['multiProxyId'] = true;
            if (vpnGeneralSettings['advpn']) queries['adVPN'] = true;

            return queries;
        },

        beforePageChange: function(currentPage, nextPage) {
            var self = this;
            self.nextPage = nextPage;

            console.log("Current Page:" + currentPage);
            console.log("Next Page : " + nextPage);

            if(self.isReadyForNextPage)
                   return true;

            var selectedEndpoints = [],
                selectedHubs = [],
                vpnGeneralSettings = this.model.get("generalsettings"),
                vpnType = vpnGeneralSettings['vpn-type'],
                hubList = this.hubListBuilder,
                endpointList = this.endpointListBuilder,
                results = false,
                numberOfEndpoints = 0,
                numberOfHubs = 0;


            var getEndpointsSelectedCallback = function(response){
                selectedEndpoints = response['vpn-devices']['device'];
            },
            getHubsSelectedCallback = function(response){
                selectedHubs = response['vpn-devices']['device'];
            };


            if (typeof endpointList  === 'undefined') {
                selectedEndpoints = [];
            } else {
                endpointList.getSelectedItems(getEndpointsSelectedCallback);
                selectedEndpoints.forEach(function(object) {
                    object.extraData = object.id;
                });
            }

            if (typeof hubList  === 'undefined') {
                selectedHubs = [];
            } else {
                hubList.getSelectedItems(getHubsSelectedCallback);
                selectedHubs.forEach(function(object) {
                    object.extraData = object.id;
                });
            }

            // Saves the selected Hubs and selected Endpoints to space model
            // for use in other wizard pages.
            this.model.set("selectedEndpointDeviceIds",selectedEndpoints);
            if (vpnType === HUB_N_SPOKE) {
                this.model.set("selectedHubDeviceIds", selectedHubs);
            }

            // If user pressed back button, then go back regardless of field validations
            if (currentPage > nextPage) {
                return true;
            }

            numberOfEndpoints = selectedEndpoints.length,
            numberOfHubs = selectedHubs.length;

            // site to site requires two selected end points and multiples of 2.
            // hub and spoke require at least one hub and one spoke.
            // full mesh requires at least two selected end points.

            if (vpnType === FULL_MESH) {
                // Must have at least 2 endpoints
                if (numberOfEndpoints < 2) {
                    console.log("need to select at least two devices");
                    this.form.showFormError(this.context.getMessage("ipsec_vpns_device_association_full_mesh_select_two_devices"));
                    return false;
                }
            }else if (vpnType === SITE_TO_SITE) {
                // site to site can't have more than 2 endpoints

                if(numberOfEndpoints < 2) {
                    console.log("Need to select two devices");
                    this.form.showFormError(this.context.getMessage("ipsec_vpns_device_association_site_to_site_select_two_devices"));
                    return false;
                } else if (numberOfEndpoints > 2 ) {
                    console.log("Can only have two devices");
                    this.form.showFormError(this.context.getMessage("ipsec_vpns_device_association_site_to_site_can_only_have_two_devices"));
                    return false;
                }
            }else if (vpnType === HUB_N_SPOKE) {
                if(numberOfEndpoints === 0 || numberOfHubs === 0) {
                    console.log("In Hub and Spoke type at least 1 Hub & 1 Spoke");
                    this.form.showFormError(this.context.getMessage("ipsec_vpns_device_association_hub_n_spoke_need_atleast_1hub_1spoke"));
                    return false;
                }
            }

            this.displaySpinner(this.el, this.context.getMessage("Waiting_status_text"));

            // Save the vpn-mo to the space model so subsequent wizard pages can use it
            this.model.set("vpnmo", this.getVpnMo());

            // Save the basic vpn details to the space model so subsequent wizard pages can use it
            this.model.set("basicvpndetails", this.getVpnBasicDetails());

            // Tell backend data store which devices were selected
            results = this.setSelectedDevices();
            return false;

           /* if (results === false) {
                return false;
            }

            // Cache the details of the selected devices datastore to backend
            results = this.cacheDeviceDetails();
            if (results === false) {
                return false;
            }

            //Validate duplicate selected device or at least one juniper device is selected
            results = this.validateDeviceSelection();
            if (results === false) {
                return false;
            }


            return results;  */
        },

        sleep: function(milliSeconds) {
            var startTime = new Date().getTime();
            while (new Date().getTime() < startTime + milliSeconds);
        },

        getSummary: function() {

            var summary = [];
            var vpnnameLabel = this.context.getMessage('vpn_wizard_endpoint_page_train_title');
            var hubList = this.model.get("selectedHubDeviceIds");
            var endpointList = this.model.get("selectedEndpointDeviceIds");
            var hubCount = 0;
            var endpointCount = 0;

            summary.push({
               'label': vpnnameLabel,
               'value': ' '
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
            };

            // Total Number of selected hubs
            summary.push({
                label: this.context.getMessage('vpn_wizard_number_of_hubs'),
                value: hubCount.toString()
            });

            // Total Number of selected Endpoints
            summary.push({
               label: this.context.getMessage('vpn_wizard_number_of_endpoints'),
               value: endpointCount.toString()
            });

            return summary;
        }
    });

    return VpnEndpointsPageView;
});
