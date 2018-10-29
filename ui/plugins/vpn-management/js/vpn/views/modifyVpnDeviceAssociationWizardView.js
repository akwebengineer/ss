/**
 * Module that implements the ModifyVpnDeviceAssociationView.
 *
 * @module ModifyVpnDeviceAssociationView
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../widgets/vpnDevicesListBuilder.js',
    '../conf/modifyVpnDeviceAssociationFormWizardConf.js',
    '../models/deviceCollection.js',
    '../models/modifyVpnSettingsModel.js',
    '../models/extranetDevicesCollection.js',
    'widgets/spinner/spinnerWidget'
], function ($, _, Backbone, Syphon, FormWidget, VpnDevicesListBuilder, ModifyVpnDeviceAssociationFormWizardConf, DeviceCollection, ModifyIpsecVpnModel, ExtranetDeviceCollection, SpinnerWidget) {

    var TYPE_VALUE_DEVICES = "Juniper",
        TYPE_VALUE_EXTRANET = "Extranet",
        HUB_N_SPOKE = "HUB_N_SPOKE",
        SITE_TO_SITE = "SITE_TO_SITE",
        FULL_MESH = "FULL_MESH";

    var ModifyVpnDeviceAssociationView = Backbone.View.extend({

        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.context;
            this.wizardView = options.wizardView;
            this.UUID = this.options.UUID;
            this.collection = new DeviceCollection();
            this.extranetDeviceCollection = new ExtranetDeviceCollection();
            this.modifyVpnModel = new ModifyIpsecVpnModel();
            this.mode =this.options.mode;
        },

        render: function() {
            var self = this;
            self.isReadyForNextPage = false;
        //    self.displaySpinner(this.el, this.context.getMessage("Waiting_status_text"));

            this.model.attributes = this.options.returnedData;

            var vpnDeviceAssociationConfig = new ModifyVpnDeviceAssociationFormWizardConf(this.context);

            this.form = new FormWidget({
                'container': this.el,
                'elements': vpnDeviceAssociationConfig.getValues(),
                'values': this.model.attributes
            });

            this.form.build();

            this.getEndpointData(this.model.attributes.id);

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

        events: {
            'click #linkClose': 'cancel'
        },

        updateDeviceAssociationCache: function() {
            var self = this;
            var updateStatus = true;
       //     var UUID = this.options.UUID;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/update-device-associations-in-cache?ui-session-id=' + self.UUID +'&overwrite-changes=true' ,
                type: 'get',
                //async: false,
                success: function(data, status) {
                    self.isReadyForNextPage = true;
                    if(self.nextPage == 0) {
                        self.options.wizardView.wizard.gotoPage(0);
                    }  else {
                        self.options.wizardView.wizard.nextPage();
                    }
                    self.destroySpinner();
                    updateStatus = true;
                },
                error: function(status) {
                    console.log('Unable to update Device Association cache');
                    self.destroySpinner();
                    updateStatus = false;
                }
            });
            return updateStatus;
        },

        // cacheDeviceDetails: function() {
        //     var results = false, self = this;
        //     $.ajax({
        //         url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/cache-device-details?ui-session-id=' + self.UUID,
        //         type: 'post',
        //         headers: {
        //             'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.cache-device-details+json;version=1;charset=UTF-8',
        //             'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.cache-device-details+json;version=1;q=0.01'
        //         },
        //         dataType: 'json',
        //         data: this.cacheDeviceDetailsRequest(),
        //         success: function (data, status, options) {
        //             results = true;
        //         },
        //         error: function(status) {
        //             results = false;
        //             console.log('failed to cache device details');
        //         },
        //         async: false
        //     });
        //     return results;
        // },

        // // This routine creates the cache device details json request 
        // cacheDeviceDetailsRequest: function() {
        //     var jsonRequestBody = {};
        //     var requestBody = {};
        //     // Get general settings that were saved from first page of wizard
        //     // var generalSettings = this.model.get("generalsettings");
        //     console.log(this.model);
        //     general_profile_id = this.model.get('id');

        //     requestBody = {
        //         "cache-device-details":{
        //            "vpn-profile-moid": "net.juniper.space.sd.vpnmanager.jpa.IPSecVPNProfileEntity:" + general_profile_id,
        //            "is-create-flow": "true"
        //         }
        //     };

        //     jsonRequestBody = JSON.stringify(requestBody);
        //     return jsonRequestBody;
        // },

        setSelectedDevices: function() {
            var self = this,
                results = false;

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/available-devices?ui-session-id=' + self.UUID,
                type: 'post',
                headers: {
                    'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.available-devices+json;version=1;charset=UTF-8',
                    'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.devices+json;version=1;q=0.01'
                },
                dataType: 'json',
                data: this.getSelectedDevicesRequestBodyJson(),
                success: function (data, status, options) {
                    self.updateDeviceAssociationCache();
                    results = true;
                },
                //async: false
            });
            return results;
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

        getVpnMo: function() {
            json = {
                //"vpn-mo": {
                    "id": this.model.attributes.id,
                    "edit-version": this.model.attributes["edit-version"],
                    "name": this.model.attributes.name,
                    "description": this.model.attributes.description,
                    "profile": this.model.attributes.profile,
                    "preshared-key": this.model.attributes["preshared-key"],
                    "preshared-key-type": this.model.attributes["preshared-key-type"],
                    "vpn-tunnel-mode-types": this.model.attributes["vpn-tunnel-mode-types"],
                    "type": this.model.attributes.type,
                    "routing-type": this.model.attributes["routing-type"],
                    "unique-key-per-tunnel": this.model.attributes["unique-key-per-tunnel"],
                     "advpn-settings": {
                            "shortcut-conn-limit": this.model.attributes["advpn-settings"]["shortcut-conn-limit"],
                            "idle-threshold": this.model.attributes["advpn-settings"]["idle-threshold"],
                            "idle-time": this.model.attributes["advpn-settings"]["idle-time"]
                      },
                    "domain-name": this.model.attributes['domain-name'],
                    "tunnel-interface-type": this.model.attributes["tunnel-interface-type"],
                    "mini-subnet-mask": this.model.attributes['mini-subnet-mask'],
                    "domain-name": this.model.attributes['domain-name'],
                    "ospf-area-id": this.model.attributes['area-id'],
                    "advpn": this.model.attributes["advpn"],
                    "auto-vpn": this.model.attributes["auto-vpn"],
                    "multi-proxyid": this.model.attributes["multi-proxyid"],
                    "max-retrans-time": this.model.attributes["max-retrans-time"],
                    "max-transmission-unit": this.model.attributes["max-transmission-unit"],
                    "allow-spoke-to-spoke-communication": this.model.attributes["allow-spoke-to-spoke-communication"],
                    "tunnel-multi-point-size": this.model.attributes["tunnel-multi-point-size"],
                    "tunnel-ip-range": this.model.attributes["tunnel-ip-range"] 
                //}
            };

            return json;

        },

        getVPNTunnelModeString: function() {
            var vpnTunnelMode = "";
            switch(this.model.get("vpn-tunnel-mode-types")) {
                case "Route Based":
                case "ROUTE_BASED":
                    vpnTunnelMode = "ROUTE_BASED";
                    break;
                case "Policy Based":
                case "POLICY_BASED":
                    vpnTunnelMode = "POLICY_BASED";
                    break;
                }
            return vpnTunnelMode;
        },

        setAvailableQueryParams: function() {
            var vptType = this.model.get("type"),
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
                           "device-ip":object["device-ip"],
                           "display-name":object["display-name"],
                           "name":object["name"]
                        });
                    }else{
                        deviceList.push({
                            "id": object.id,
                            "type":"H",
                            "device-ip":object["device-ip"],
                            "display-name":object["display-name"],
                            "name":object["name"]
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
                           "device-ip":object["device-ip"],
                           "display-name":object["display-name"],
                           "name":object["name"]
                        });
                    }else{
                        deviceList.push({
                            "id": object.id,
                            "type":"E",
                             "device-ip":object["device-ip"],
                             "display-name":object["display-name"],
                             "name":object["name"]
                        });
                    }
              });

            requestBody = {
                "fetch-type": "Devices",
//                "reset-store": "false",
                "reset-store": "true",
                "selected-devices": {"device-ids":deviceList},
                "extranet-devices": {"extranet-ids":extranetList}
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

        validateDeviceSelection: function(){
            var results = false;

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/validate-device-selection?ui-session-id=' + this.UUID,
                type: 'get',
                headers: {
                    'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.validation-response+json;version=1;q=0.01'
                },
                dataType: 'json',
                success: function (data, status, options) {
                    results = data["validation-response"]["is-valid"];
                },
                error: function(status) {
                    console.log('device selection validation failed');
                },
                async: false
            });
            return results;
        },

        getEndpointData: function(linkValue) {
            var self = this;
            self.displaySpinner(this.el, this.context.getMessage("Waiting_status_text"));

            //var UUID = this.options.UUID;
            var endpointList = [];
            var hubList = [];
            $.ajax({
                url: "/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/device-association?ui-session-id=" + this.UUID,
                type: 'get',
                headers: {
                   'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.devices-association+json;version=1;q=0.01'
                },

                success: function(response, status) {
                    response['available-devices']['device'].forEach(function(object) {
                        if(object['is-hub'] == true) {
                            hubList.push(object.id);
                        } else {
                            endpointList.push(object.id);
                        }
                    });
                    self.destroySpinner();
                    self.buildEndpointsListBuilder(endpointList, hubList);

                },
                error: function() {
                    self.destroySpinner();
                    self.buildEndpointsListBuilder(endpointList, hubList);
                }
                //async: false
            });

        },

        buildEndpointsListBuilder: function(endpointList, hubList){
            var self = this,
                endpointListContainer = this.$el.find('#endpoint'),
                vpnType = self.model.get("type");

            self.endpointListBuilder = new VpnDevicesListBuilder({
                context: self.context,
                container: endpointListContainer,
                selectedItems: endpointList,
                queries: self.generateQueryPara(),
                id: "vpn-endpoint-list"
            });

            this.endpointListBuilder.build(function() {
                endpointListContainer.find('#slipstream_list_builder_widget_vpn-endpoint-list').unwrap();
                if (vpnType === HUB_N_SPOKE){
                    self.buildHubListBuilder(hubList);
                    self.updatedConf();
                }
            });

            this.$el.find("input[type=radio][name=vpn-endpoint-selection-filter]").click(function (){
                if (this.value === TYPE_VALUE_DEVICES) {
                    self.endpointListBuilder.filterByTypes(TYPE_VALUE_DEVICES);
                } else if (this.value === TYPE_VALUE_EXTRANET) {
                    self.endpointListBuilder.filterByTypes(TYPE_VALUE_EXTRANET);
                }
            });
        },

        buildHubListBuilder: function(hubList){
            var self = this,
                hubListContainer = this.$el.find('#hub');

            hubListContainer.parents('.list-builder').removeClass('hide').prev().removeClass('hide');

            self.hubListBuilder = new VpnDevicesListBuilder({
                context: self.context,
                container: hubListContainer,
                selectedItems: hubList,
                queries: self.generateQueryPara(),
                id: "vpn-hub-list"
            });

            this.hubListBuilder.build(function() {
                hubListContainer.find('#slipstream_list_builder_widget_vpn-hub-list').unwrap();
            });

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
            var vpnAttributes =  this.model.attributes;

            if (vpnAttributes['type'] === "HUB_N_SPOKE") {

                if(vpnAttributes['auto-vpn'] || vpnAttributes['advpn']){
                    self.$el.find('#vpn-hub-extranet').hide();
                    self.$el.find('#vpn-hub-extranet').closest('.elementinput').hide();
                    self.$el.find('#vpn-endpoint-extranet').hide();
                    self.$el.find('#vpn-endpoint-extranet').closest('.elementinput').hide();
                }
            }

        },

        generateQueryPara: function(){
            var queries = {
                'tunnelMode': this.model.get("vpn-tunnel-mode-types"),
                'deviceType': 'Juniper'
            };

            if (this.model.get('auto-vpn')) queries['autoVPN'] = true;
            if (this.model.get('multi-proxyid')) queries['multiProxyId'] = true;
            if (this.model.get('advpn')) queries['adVPN'] = true;

            return queries;
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
       },

       beforePageChange:function (currentPage, nextPage) {
           var self = this;
           self.nextPage = nextPage;

           console.log("Current Page:" + currentPage);
           console.log("Next Page : " + nextPage);

           if(self.isReadyForNextPage) {

              return true;
           }

            var mode = this.getVPNTunnelModeString().toUpperCase();
            if(mode === "POLICY_BASED"){
            this.wizardView.wizard.mode = mode;
             }
            var selectedEndpoints = [],
            selectedHubs = [],
            vpnType = this.model.get("type"),
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
        }

        if (typeof hubList  === 'undefined') {
            selectedHubs = [];
        } else {
            hubList.getSelectedItems(getHubsSelectedCallback);
        }

        // Saves the selected Hubs and selected Endpoints to space model
        // for use in other wizard pages.
        this.model.set("selectedEndpointDeviceIds",selectedEndpoints);
        if (vpnType === HUB_N_SPOKE) {
            this.model.set("selectedHubDeviceIds", selectedHubs);
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
        self.displaySpinner(self.el, self.context.getMessage("Waiting_status_text"));

        // Tell backend data store which devices were selected
        results = this.setSelectedDevices();
        return false;
//        if (results === false) {
//            return false;
//        }


        // Cache the details of the selected devices datastore to backend
        //results = this.updateDeviceAssociationCache();
//        if (results === false) {
//            return false;
//        }

        // //Validate duplicate selected device or at least one juniper device is selected
        // results = this.validateDeviceSelection();
        // if (results === false) {
        //     return false;
        // }

//        return results;

       },

        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        },

        getTitle: function () {
          return this.context.getMessage('vpn_wizard_endpoint_page_title');
        }
    });

    return ModifyVpnDeviceAssociationView;
});
