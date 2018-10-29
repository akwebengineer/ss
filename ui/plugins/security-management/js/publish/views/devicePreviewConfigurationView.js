/**
 * Preview device configuration page
 *
 * @module PreviewConfiguration
 * @author vinayms <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    '../conf/devicePreviewConf.js',
    './deviceConfigurationFormView.js',
    'widgets/progressBar/progressBarWidget',
    '../models/sdDeviceModel.js',
    './../../../../sd-common/js/publish/constants/previewConfgConstants.js'
],  function (Backbone,
        Syphon,
        FormWidget,
        OverlayWidget,
        DeviceConfigurationViewConf,
        DeviceConfigurationFormView,
        ProgressBarWidget,
        DeviceModel,
        PreviewConfgConstants) {

    var DevicePreviewConfView = Backbone.View.extend({

        /**
         *   add event for
         *   closing,
         *   update
         */
        events: {
            'click #btnPreviewConf': 'submit',
            'click #linkUpdateCancel': 'closeOverlay'
        },
        /**
         *  Initialize all the view require params
         */
        initialize: function () {
            var self = this, deviceID;
            self.activity = self.options.activity;
            self.context = self.activity.context;
            self.selectedDevices = self.options.selectedDevices;

            if($.isArray(self.selectedDevices)) {
                deviceID = self.selectedDevices[0];
            } else{
                deviceID = self.selectedDevices;
            }

            self.deviceModel = new DeviceModel();
            self.deviceModel.set('id', deviceID);
            self.deviceModel.fetch();

            // fetch the global update options
            self.model.fetch();
        },

        /**
         *  Renders the form view in a overlay.
         *  returns this object
         */
        render: function () {
            var self = this, options = self.model.attributes, previewConfFormConf = new DeviceConfigurationViewConf(this.context);

            // build the device preview configuration form
            this.formWidget = new FormWidget({
                "elements" : previewConfFormConf.getValues(options),
                "container" : this.el
            });
            this.formWidget.build();
            this.$el.addClass('security-management');

            return this;
        },
        /**
         *  final submit on update click
         */
        submit: function(){

            var self = this,
                properties = Syphon.serialize(self),
                jsonData,
                serviceTypes = [],
                deviceName = self.deviceModel.attributes.device? self.deviceModel.attributes.device.name :"Device";

            // push all the selected service type.
            if(properties['firewallPolicy'] === true){
                serviceTypes.push(PreviewConfgConstants.POLICY);
            }
            if(properties['ipsPolicy'] === true){
                serviceTypes.push(PreviewConfgConstants.IPSPOLICY);
            }
            if(properties['nat'] === true){
                serviceTypes.push(PreviewConfgConstants.NAT);
            }
            if(properties['vpn'] === true){
                serviceTypes.push(PreviewConfgConstants.VPN);
            }
            // bulding the required Json format for Update
            jsonData = {
                "preview-devices": {
                    "sd-device-ids": {
                        "id": $.isArray(self.selectedDevices)? self.selectedDevices : [self.selectedDevices]
                    },
                    "service-types": {
                        "service-type": serviceTypes
                    }
                }
            };

            $.ajax({
                url: PreviewConfgConstants.DEVICE_PREVIEW_CONF_URL,
                type: 'POST',
                dataType:"json",
                data: JSON.stringify(jsonData),
                headers:{
                    'accept': PreviewConfgConstants.DEVICE_PREVIEW_CONF_ACCEPT_HEADER,
                    'content-type': PreviewConfgConstants.DEVICE_PREVIEW_CONF_CONTENT_TYPE_HEADER

                },
                success: function(data, status){

                    var jsonJobIds = data['monitorable-task-instances']['monitorable-task-instance-managed-object'], jobId;

                    // TODO: remove this once multi preview is completed
                    if(Object.prototype.toString.call( jsonJobIds ) === '[object Array]'){
                        jobId = jsonJobIds[0].id;
                    } else {
                        jobId = jsonJobIds.id;
                    }
                    /*
                     * launches the Job Details overlay
                     */
                    if(jobId){
                        self.closeOverlay();
                        self.overlay = new OverlayWidget({
                            view: new DeviceConfigurationFormView({activity: self, jobId: jobId, title: 'View configuration for '+deviceName}),
                            type: "large",
                            showScrollbar: true
                        });
                        self.overlay.build();
                        // build the progressBar widget, by setting the overlay container to the progressBar container.
                        // as per new progressbar changes get the overlay container and assign to the progressbar
                        self.progressBar = new ProgressBarWidget({
                             "container": self.overlay.getOverlayContainer(), 
                             "hasPercentRate": false,
                             "inOverlay" : true,
                             "statusText": self.context.getMessage('device_view_configuration_progress_message')
                        }).build();
                    }

                }
            });
        },
        /**
         *   destroy the overlay
         */
        closeOverlay: function (event) {
            this.activity.overlay.destroy();
        }

    });

    return DevicePreviewConfView;
});
