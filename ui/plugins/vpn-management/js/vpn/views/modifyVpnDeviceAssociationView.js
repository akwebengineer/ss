/**
 * Module that implements the ModifyVpnDeviceAssociationView.
 *
 * @module ModifyVpnDeviceAssociationView
 * @author balasaritha <balasaritha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/listBuilder/listBuilderWidget',
    '../conf/modifyVpnDeviceAssociationFormConf.js',
    '../models/deviceCollection.js',
    '../models/modifyVpnSettingsModel.js',
    '../models/extranetDevicesCollection.js'
], function ($, _, Backbone, Syphon, FormWidget, ListBuilderWidget, ModifyVpnDeviceAssociationFormConf, DeviceCollection, ModifyIpsecVpnModel, ExtranetDeviceCollection) {

    var ModifyVpnDeviceAssociationView = Backbone.View.extend({

        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.context;
            this.collection = new DeviceCollection();
            this.extranetDeviceCollection = new ExtranetDeviceCollection();
            this.modifyVpnModel = new ModifyIpsecVpnModel();
        },

        render: function() {
            var self = this;
            this.clearCache();
            var returnedData = this.loadVpn();
            this.model.attributes = returnedData['ipsec-vpn'];

            var vpnDeviceAssociationConfig = new ModifyVpnDeviceAssociationFormConf(this.context);
            this.setVPNTypeString();

            this.form = new FormWidget({
                'container': this.el,
                'elements': vpnDeviceAssociationConfig.getValues(),
                'values': this.model.attributes
            });

            this.form.build();

            this.getEndpointData(this.model.attributes.id);
            this.showHideHubList();

            return this;
        },

        events: {
            'click #btnOk': 'submit',
            'click #linkClose': 'cancel'
        },

        submit: function(event) {
            event.preventDefault();

            var self = this,
            formData = Syphon.serialize(this),
            json;
            var deviceList = self.getSelectedDeviceEndpointList().concat(self.getSelectedExtranetEndpointList());

            if(deviceList.length == 2) {
                this.setSelectedDevices();
                this.cancel(event);
            } else {
                console.log ('Please select two devices');
            }

        },

        clearCache: function() {
            var clearStatus = false;
            var UUID = this.options.UUID;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/reset-cache?ui-session-id=' + UUID,
                type: 'get',
                success: function(data, status) {
                    clearStatus = true;
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
            var UUID = this.options.UUID;
            var returnData ;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/'+this.options.selectedRow+'?ui-session-id=' + UUID,
                type: 'get',
                dataType: 'json',
                headers: {
                   'Accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpn+json;version=1;q=0.01'
                },
                success: function(data, status) {
                    returnData = data;
                    loadStatus = true;
                },
                async: false,
                error: function(status) {
                    console.log('Unable to clear cache');
                    loadStatus = false;
                }
            });

            return returnData;
        },

        updateDeviceAssociationCache: function() {
            var self = this;
            var updateStatus = false;
            var UUID = this.options.UUID;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/update-device-associations-in-cache?ui-session-id=' + UUID ,
                type: 'get',
               success: function(data, status) {
                    self.getDeviceAssociationData("test");

                    updateStatus = true;
                },
                async: false,
                error: function(status) {
                    console.log('Unable to update Device Association cache');
                }
            });

            return updateStatus;
        },


        saveVpn: function() {
            var saveStatus = false;
            var UUID = this.options.UUID;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/save-endpoints?ui-session-id=' + UUID +'&overwrite-changes=true',
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

        setSelectedDevices: function() {
        var self = this;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/available-devices?ui-session-id=' + this.options.UUID,
                type: 'post',
                headers: {
                    'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.available-devices+json;version=1;charset=UTF-8',
                    'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.devices+json;version=1;q=0.01'
                },
                dataType: 'json',
                data: this.getSelectedDevicesRequestBodyJson(self.getSelectedDeviceEndpointList(),self.getSelectedExtranetEndpointList(),"Devices",true),
                success: function (data, status, options) {
                self.updateDeviceAssociationCache();
                }
            });
        },

        getFinalSelectionList: function(deviceEndpointList,extranetEndpointList,fetchType,resetStore) {
            var requestBody = {};
            requestBody = {
                "available-devices": {
                    "vpn-mo": this.getVpnMo(),
                    "query-params": this.getSelectedDevicesQueryParams()
                }
            };
            return requestBody;
        },

        // This routine returns selected devices request body
        getSelectedDevicesRequestBody: function(deviceEndpointList,extranetEndpointList,fetchType,resetStore) {
            var requestBody = {};
            requestBody = {
                "available-devices": {
                    "vpn-mo": this.getVpnMo(),
                    "query-params": this.setAvailableQueryParams(deviceEndpointList,extranetEndpointList,fetchType,resetStore)
                }
            };
            return requestBody;
        },
        getVpnMo: function() {

            json = {
                //"vpn-mo": {
                    //"id": this.model.attributes.id,
                    //"edit-version": this.model.attributes["edit-version"],
                    //"name": this.model.attributes.name,
                    //"description": this.model.attributes.description,
                    //"profile": this.model.attributes.profile,
                    //"preshared-key-type": this.model.attributes["preshared-key-type"],
                    "vpn-tunnel-mode-types": this.model.attributes["vpn-tunnel-mode-types"],
                    //"type": this.model.attributes.type,
                    //"routing-type": this.model.attributes["routing-type"],
                    //"unique-key-per-tunnel": this.model.attributes["unique-key-per-tunnel"],
                    //"advpn-settings": this.model.attributes["advpnSettings"],
                    //"domain-name": this.model.attributes['domain-name'],
                    //"tunnel-interface-type": this.model.attributes["tunnel-interface-type"],
                    //"mini-subnet-mask": this.model.attributes['mini-subnet-mask'],
                    //"domain-name": this.model.attributes['domain-name'],
                    //"ospf-area-id": this.model.attributes['area-id'],
                    "advpn": false,
                    "auto-vpn": false
                    //"multi-proxyid": "false",
                    //"max-retrans-time": this.model.attributes['max-retrans-time'],
                    //"max-transmission-unit": this.model.attributes['max-transmission-unit'],
                    //"allow-spoke-to-spoke-communication": this.model.attributes['allow-spoke-to-spoke-communication'],
                    //"tunnel-multi-point-size": this.model.attributes['tunnel-multi-point-size']
                //}
            };

            return json;

        },

        setAvailableQueryParams: function(deviceEndpointList,extranetEndpointList,fetchType,resetStore) {
            var requestBody = {};
            //var selectedEndpoints = this.endpointListBuilder.getSelectedItems();
            var deviceList=[];
            var extranetList=[];
            deviceEndpointList.forEach(function(object) {

                if(object.extraData.isHub) {
                    deviceList.push({
                        "id": object.extraData.id,
                        "type": "H"
                    });
                } else {
                    deviceList.push({
                        "id": object.extraData.id,
                        "type": "E"
                    });
                }


            });

            extranetEndpointList.forEach(function(object) {
                if(object.extraData.isHub) {
                    extranetList.push({
                        "id": object.extraData.id,
                        "type": "H"
                    });
                } else {
                    extranetList.push({
                        "id": object.extraData.id,
                        "type": "E"
                    });
                }
            });


            requestBody = {
                        "fetch-type": fetchType,
                        "reset-store": resetStore,
                        "selected-devices": {"device-ids":deviceList},
                        "extranet-devices": {"extranet-ids":extranetList}
            };
            return requestBody;
        },

        getSelectedDeviceEndpointList: function() {
            var self = this;
            var deviceEndpoints = self.endpointListBuilder.getSelectedItems();
            var deviceHubs = self.hubListBuilder.getSelectedItems();
            var deviceList=[];

            deviceEndpoints.forEach(function(object) {
                    //deviceList.push(object);
                   deviceList.push({
                                'extraData': JSON.parse(object['extraData'])//object['id'],//object['moid'],//object.id,
                   });

            });
            deviceHubs.forEach(function(object) {
                   deviceList.push({
                                'extraData': JSON.parse(object['extraData'])//object['id'],//object['moid'],//object.id,
                   });
            });
            return deviceList;
        },

        getSelectedExtranetEndpointList: function() {
            var self = this;
            var extranetDeviceEndpoints = self.extranetEndpointListBuilder.getSelectedItems();
            var extranetDeviceHubs = self.extranetHubListBuilder.getSelectedItems();
            var extranetList=[];

            extranetDeviceEndpoints.forEach(function(object) {
                   extranetList.push({
                                'extraData': JSON.parse(object['extraData'])//object['id'],//object['moid'],//object.id,
                   });
            });
            extranetDeviceHubs.forEach(function(object) {
                   extranetList.push({
                                'extraData': JSON.parse(object['extraData'])//object['id'],//object['moid'],//object.id,
                   });

            });
            return extranetList;
        },

        getSelectedDevicesQueryParams: function() {
            var self = this;
            var deviceEndpoints = self.endpointListBuilder.getSelectedItems();
            var deviceHubs = self.hubListBuilder.getSelectedItems();
            var extranetDeviceEndpoints = self.extranetEndpointListBuilder.getSelectedItems();
            var extranetDeviceHubs = self.extranetHubListBuilder.getSelectedItems();

            var requestBody = {};
            //var selectedEndpoints = this.endpointListBuilder.getSelectedItems();
            var deviceList=[];
            var extranetList=[];

            deviceEndpoints.forEach(function(object) {
                    deviceList.push({
                        "id": object.extraData.id,
                        "type": "E"
                    });
            });
            deviceHubs.forEach(function(object) {
                    deviceList.push({
                        "id": object.extraData.id,
                        "type": "H"
                    });
            });

           extranetDeviceEndpoints.forEach(function(object) {
                    extranetList.push({
                        "id": object.extraData.id,
                        "type": "E"
                    });
            });
            extranetDeviceHubs.forEach(function(object) {
                    extranetList.push({
                        "id": object.extraData.id,
                        "type": "H"
                    });
            });

            requestBody = {
                        "fetch-type": "Devices",
                        "reset-store": false,
                        "selected-devices": {"device-ids":deviceList},
                        "extranet-devices": {"extranet-ids":extranetList}
            };
            return requestBody;
        },

        // This routine returns the json selected devices request body
        getSelectedDevicesRequestBodyJson: function(deviceEndpointList,extranetEndpointList,fetchType,resetStore) {
            var requestBody = {};
            var jsonRequest = {};

            requestBody = this.getSelectedDevicesRequestBody(deviceEndpointList,extranetEndpointList,fetchType,resetStore);
            jsonRequest = JSON.stringify(requestBody);
            return jsonRequest;
        },

        getSelectedDevices: function(fetchType) {
            var self = this;
            var deviceEndpoints = self.endpointListBuilder.getSelectedItems();
            var deviceHubs = self.hubListBuilder.getSelectedItems();
            var extranetDeviceEndpoints = self.extranetEndpointListBuilder.getSelectedItems();
            var extranetDeviceHubs = self.extranetHubListBuilder.getSelectedItems();
            var deviceBeanJson=[];

            for(var i=0; i<deviceEndpoints.length; i++) {
                deviceEndpoint = deviceEndpoints[i];
                    var json = {"vpn-device-bean": {
                        "is-hub": false,
                        "extranet-device" : false,
                        "device-moid": deviceEndpoint.extraData
                    }
                };
                deviceBeanJson.push(json);
            }

            for(var i=0; i<deviceHubs.length; i++) {
                deviceHub = deviceHubs[i];
                    var json = {"vpn-device-bean": {
                        "is-hub": true,
                        "extranet-device": false,
                        "device-moid": deviceHub.extraData
                    }
                };
                deviceBeanJson.push(json);
            }

            for(var i=0; i<extranetDeviceEndpoints.length; i++) {
                extranetDeviceEndpoint = extranetDeviceEndpoints[i];
                    var json = {"vpn-device-bean": {
                        "is-hub": false,
                        "extranet-device" : true,
                        "device-moid": extranetDeviceEndpoint.extraData
                    }
                };
                deviceBeanJson.push(json);
            }

            for(var i=0; i<extranetDeviceHubs.length; i++) {
                extranetDeviceHub = extranetDeviceHubs[i];
                    var json = {"vpn-device-bean": {
                        "is-hub": true,
                        "extranet-device": true,
                        "device-moid": extranetDeviceHub.extraData
                    }
                };
                deviceBeanJson.push(json);
            }

            return deviceBeanJson;
        },

        getExtraDataObject: function(deviceId) {
            var returnObject = new Object();
            //returnObject.extraData = new Object();
            returnObject.id = deviceId;

            return JSON.stringify(returnObject);
        },

        getData: function (deviceEndpointList, extranetEndpointList) {
            var self = this,
                hubListContainer = this.$el.find('#hub'),
                endpointListContainer = this.$el.find('#endpoint'),
                extranetHubListContainer = this.$el.find('#extranet-hub'),
                extranetEndpointListContainer = this.$el.find('#extranet-endpoint');

            var hubListAvailable = [],
                hubListSelected = [],
                endpointListAvailable = [],
                endpointListSelected = [];

            var extranetHubListAvailable = [],
                extranetHubListSelected = [],
                extranetEndpointListAvailable = [],
                extranetEndpointListSelected = [];


            var type = this.model.attributes.type;

            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/available-devices?ui-session-id=' + self.options.UUID ,
                type: 'post',
                headers: {
                    'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.available-devices+json;version=1;charset=UTF-8',
                    'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.devices+json;version=1;q=0.01'
                },
                dataType: 'json',
                data: this.getSelectedDevicesRequestBodyJson(deviceEndpointList,extranetEndpointList,"Devices",true),
                success: function (data, status, options) {

                    var deviceList = [];

                    data['available-devices'].device.forEach(function(object) {

                        if(object['type'] == "E") {
                            var extraData = {
                                    'id': object['id'],
                                    'isHub': false
                            };
                            deviceList.push({
                                'label': object['display-name'],
                                'value': object['device-ip'],
                                'valueDetails': object['domain-name'],
                                'extraData': JSON.stringify(extraData),//object['id'],//object['moid'],//object.id,
                                'isHub': "false"
                            });
                        } else {
                            var extraData = {
                                    'id': object['id'],
                                    'isHub': true
                            };
                            deviceList.push({
                                'label': object['display-name'],
                                'value': object['device-ip'],
                                'valueDetails': object['domain-name'],
                                //'extraData': self.getExtraDataObject(object['id']),//object['moid'],//object.id,
                                'extraData': JSON.stringify(extraData),//object['id'],//object['moid'],//object.id,
                                'isHub': "true"
                            });
                        }
                    });

                    if(type !== "HUB_N_SPOKE") {
                        for(var i=0; i<deviceList.length;i++) {
                                endpointListAvailable.push(deviceList[i]);
                        }
                        for(var i=0; i<deviceEndpointList.length;i++) {
                            if(!(deviceEndpointList[i].isHub)) {


                                    var extraData = {
                                            'id': deviceEndpointList[i]['extraData'].id,
                                            'isHub': false
                                    };
                                    endpointListSelected.push({
                                        'label': deviceEndpointList[i]['label'],
                                        'value': deviceEndpointList[i]['value'],
                                        'valueDetails': deviceEndpointList[i]['valueDetails'],
                                        'extraData': JSON.stringify(extraData),//deviceEndpointList[i]['extraData'].id,//object.id,
                                        'isHub': "false"
                                    });
                           }
                        }

                    } else {
                        var flag = false;
                        for(var i=0; i<deviceList.length;i++) {
                            hubListAvailable.push(deviceList[i]);
                            endpointListAvailable.push(deviceList[i]);
                        }
                        for(var i=0; i<deviceEndpointList.length;i++) {
                            if(!(deviceEndpointList[i].isHub)) {
                                    var extraData = {
                                            'id': deviceEndpointList[i]['extraData'].id,
                                            'isHub': false
                                    };
                                    endpointListSelected.push({
                                        'label': deviceEndpointList[i]['label'],
                                        'value': deviceEndpointList[i]['value'],
                                        'valueDetails': deviceEndpointList[i]['valueDetails'],
                                        'extraData': JSON.stringify(extraData),//deviceEndpointList[i]['extraData'].id,//object.id,
                                        'isHub': "false"
                                    });
                               } else if(deviceEndpointList[i].isHub) {
                                    var extraData = {
                                            'id': deviceEndpointList[i]['extraData'].id,
                                            'isHub': true
                                    };
                                    hubListSelected.push({
                                        'label': deviceEndpointList[i]['label'],
                                        'value': deviceEndpointList[i]['value'],
                                        'valueDetails': deviceEndpointList[i]['valueDetails'],
                                        'extraData': JSON.stringify(extraData),//deviceEndpointList[i]['extraData'].id,//object.id,
                                        'isHub': "true"
                                    });

                               }
                            }
                    }

                    self.hubListBuilder = new ListBuilderWidget({
                        "list": {"availableElements": hubListAvailable,
                                "selectedElements": hubListSelected},
                        "container": hubListContainer
                    });
                    self.hubListBuilder.build();
                    hubListContainer.children().attr('id','endpoint');
                    hubListContainer.find('.list-builder-widget').unwrap();

                    $('#endpoint .box2 .list-group').on('selectedChangeEvent', function(event, list){
                        if (list && list.event && list.event === 'select') {
                            var removedItems = list.data.map(function(item) {
                                return item.value;
                            });
                           self.endpointListBuilder.removeAvailableItems(removedItems);
                        } else if (list && list.event && list.event === 'unselect') {
                                   self.endpointListBuilder.addAvailableItems(list.data);
                        }
                    });

                    self.endpointListBuilder = new ListBuilderWidget({
                        "list": {"availableElements": endpointListAvailable,
                                "selectedElements": endpointListSelected},
                        "container": endpointListContainer
                    });
                    self.endpointListBuilder.build();
                    endpointListContainer.children().attr('id','hub');
                    endpointListContainer.find('.list-builder-widget').unwrap();

                    $('#hub .box2 .list-group').on('selectedChangeEvent', function(event, list){
                        if (list && list.event && list.event === 'select') {
                            var removedItems = list.data.map(function(item) {
                                return item.value;
                            });

                            self.hubListBuilder.removeAvailableItems(removedItems);
                      } else if (list && list.event && list.event === 'unselect') {
                            self.hubListBuilder.addAvailableItems(list.data);
                      }
                    });
                }
        });


             $.ajax({
                 url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/available-devices?ui-session-id=' + self.options.UUID ,
                 type: 'post',
                 headers: {
                     'content-type': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.available-devices+json;version=1;charset=UTF-8',
                     'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.devices+json;version=1;q=0.01'
                 },
                 dataType: 'json',
                 data: this.getSelectedDevicesRequestBodyJson(deviceEndpointList,extranetEndpointList,"Extranet Devices",true),
                 success: function (data, status, options) {


                    var extranetDeviceList = [];

                    data['available-devices'].device.forEach(function(object) {
                        if(object['type'] == "E") {
                            var extraData = {
                                    'id': object['id'],
                                    'isHub': false
                            };
                            extranetDeviceList.push({
                                'label': object['display-name'],
                                'value': object['device-ip'],
                                'valueDetails': object['domain-name'],
                                'isHub': "false",
                                'extraData': JSON.stringify(extraData)//self.getExtraDataObject(object['id']),//object['moid'],//object.id,

                            });
                        } else {
                            var extraData = {
                                    'id': object['id'],
                                    'isHub': true
                            };
                            extranetDeviceList.push({
                                'label': object['display-name'],
                                'value': object['device-ip'],
                                'valueDetails': object['domain-name'],
                                //'extraData': object['moid'],//object.id,
                                'isHub': "true",
                                'extraData': JSON.stringify(extraData)//self.getExtraDataObject(object['id']),//object['moid'],//object.id,
                            });
                        }
                    });

                    if(type !== "HUB_N_SPOKE") {
                        for(var i=0; i<extranetDeviceList.length;i++) {
                                extranetEndpointListAvailable.push(extranetDeviceList[i]);
                        }
                        for(var i=0; i<extranetEndpointList.length;i++) {
                            if(!(extranetEndpointList[i].isHub)) {
                                    var extraData = {
                                            'id': extranetEndpointList[i]['extraData'].id,//object['id'],
                                            'isHub': true
                                    };
                                    extranetEndpointListSelected.push({
                                        'label': extranetEndpointList[i]['label'],
                                        'value': extranetEndpointList[i]['value'],
                                        'valueDetails': extranetEndpointList[i]['valueDetails'],
                                        'isHub': "false",
                                        'extraData': JSON.stringify(extraData)//extranetEndpointList[i]['extraData'].id,//self.getExtraDataObject(extranetEndpointList[i]['extraData'].id),//object.id,


                                    });
                           }
                        }
                    } else {
                        for(var i=0; i<extranetDeviceList.length;i++) {
                            extranetHubListAvailable.push(extranetDeviceList[i]);
                            extranetEndpointListAvailable.push(extranetDeviceList[i]);
                        }
                        for(var i=0; i<extranetEndpointList.length;i++) {
                            if(!(extranetEndpointList[i].isHub)) {
                                    extranetEndpointListSelected.push({
                                        'label': extranetEndpointList[i]['label'],
                                        'value': extranetEndpointList[i]['value'],
                                        'valueDetails': extranetEndpointList[i]['valueDetails'],
                                        'extraData': JSON.stringify(extranetEndpointList[i]['extraData']),//self.getExtraDataObject(extranetEndpointList[i]['extraData'].id),//object.id,
                                        'isHub': "false"
                                    });
                               } else if(extranetEndpointList[i].isHub) {
                                    extranetHubListSelected.push({
                                        'label': extranetEndpointList[i]['label'],
                                        'value': extranetEndpointList[i]['value'],
                                        'valueDetails': extranetEndpointList[i]['valueDetails'],
                                        'extraData': JSON.stringify(extranetEndpointList[i]['extraData']),//self.getExtraDataObject(extranetEndpointList[i]['extraData'].id),//object.id,
                                        'isHub': "true"
                                    });

                               }
                            }
                    }

                    self.extranetHubListBuilder = new ListBuilderWidget({
                        "list": {"availableElements": extranetHubListAvailable,
                                "selectedElements": extranetHubListSelected},
                        "container": extranetHubListContainer
                    });
                    self.extranetHubListBuilder.build();
                    extranetHubListContainer.children().attr('id','extranet-endpoint');
                    extranetHubListContainer.find('.list-builder-widget').unwrap();

                    $('#extranet-endpoint .box2 .list-group').on('selectedChangeEvent', function(event, list){
                        if (list && list.event && list.event === 'select') {
                            var removedItems = list.data.map(function(item) {
                                return item.value;
                            });

                           self.extranetEndpointListBuilder.removeAvailableItems(removedItems);
                        } else if (list && list.event && list.event === 'unselect') {
                            self.extranetEndpointListBuilder.addAvailableItems(list.data);
                        }
                    });

                    self.extranetEndpointListBuilder = new ListBuilderWidget({
                        "list": {"availableElements": extranetEndpointListAvailable,
                                "selectedElements": extranetEndpointListSelected},
                        "container": extranetEndpointListContainer
                    });
                    self.extranetEndpointListBuilder.build();
                    extranetEndpointListContainer.children().attr('id','extranet-hub');
                    extranetEndpointListContainer.find('.list-builder-widget').unwrap();

                    $('#extranet-hub .box2 .list-group').on('selectedChangeEvent', function(event, list){
                        if (list && list.event && list.event === 'select') {
                            var removedItems = list.data.map(function(item) {
                                return item.value;
                            });

                            self.extranetHubListBuilder.removeAvailableItems(removedItems);
                        } else if (list && list.event && list.event === 'unselect') {
                            self.extranetHubListBuilder.addAvailableItems(list.data);
                        }
                    });
               }
             });
        },

        showHideHubList: function() {
            switch(this.model.attributes.type) {
                case "HUB_N_SPOKE":
                    this.$el.find('.hub').show();
                    break;
                case "FULL_MESH":
                    this.$el.find('.hub').hide();
                    break;
                case "SITE_TO_SITE":
                    this.$el.find('.hub').hide();
                    break;
            }
        },

        setVPNTypeString: function() {
            var vpnType="";
            switch(this.model.attributes.type) {
                case "HUB_N_SPOKE":
                    vpnType = "Hub And Spoke";
                    break;
                case "FULL_MESH":
                    vpnType = "Full Mesh";
                    break;
                case "SITE_TO_SITE":
                    vpnType = "Site To Site";
                    break;
            }

            this.model.attributes.vpnType = vpnType;
        },

        getEndpointData: function(linkValue) {
            var self = this;
            var UUID = this.options.UUID;
            var deviceEndpointList = [];
            var extranetEndpointList = [];
            $.ajax({
                url: "/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/device-association?ui-session-id=" + UUID,
                type: 'get',
                headers: {
                   'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.devices-association+json;version=1;q=0.01'
                },

                success: function(response, status) {
                    response['available-devices']['device'].forEach(function(object) {
                        var extraData = {
                                'id': object['id'],
                                'is-extranet': object['is-extranet'],
                                'is-hub': object['is-hub']
                        };

                        if(object['is-extranet'] == true) {
                            extranetEndpointList.push({
                                'label': object['display-name'],
                                'value': object['display-name'],
                                'valueDetails': object['domain-name'],
                                'extraData': extraData,
                                'isHub': object['is-hub']
                            });
                        } else {
                            deviceEndpointList.push({
                                'label': object['display-name'],
                                'value': object['display-name'],
                                'valueDetails': object['domain-name'],
                                'extraData': extraData,
                                'isHub': object['is-hub']
                            });
                        }
                    });

                },
                error: function() {
                    var errorList = [];
                    errorList.push({'label': "test", 'value': "test"});
                    errorList.push({'label': "test1", 'value': "test1"});
                    errorList.push({'label': "test2", 'value': "test2"});
                },
                async: false
            });

            this.getData(deviceEndpointList, extranetEndpointList);
        },

       getDeviceAssociationData: function(linkValue) {
            var self = this;
            var UUID = this.options.UUID;
            $.ajax({
                url: "/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/device-association?ui-session-id=" + UUID,
                type: 'get',
                headers: {
                   'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.devices-association+json;version=1;q=0.01'
                },
                success: function(response, status) {
                   self.saveVpn();
                },
                error: function() {
                },
                async: false
            });
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
