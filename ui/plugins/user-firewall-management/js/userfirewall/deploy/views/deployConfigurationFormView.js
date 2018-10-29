/**
 * The device configuration view page
 *
 * @module deployConfigurationFormView
 * @author svaibhav
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../../../../../sd-common/js/publish/conf/deviceViewConfigurationFormConf.js',
    './deployXmlCliConfigurationView.js',
    './deployConfigurationTabView.js',
    'text!../../../../../sd-common/js/publish/templates/deviceConfigurationLegend.html'
], function (Backbone,
        Syphon,
        FormWidget,
        DeployConfigurationFormConf,
        XmlCliView,
        DeployConfTabView,
        LegendTemplate) {

    var previewConfigurationFormView = Backbone.View.extend({
        /**
         *   add event for closing the vew conf overlay.
         */
        events: {
            'click #deviceConfOk': 'closeOverlay'
        },
        /**
         *  Initialize all the view require params
         */
        initialize: function () {
            var self = this;
            self.activity = self.options.activity;
            self.deviceDisplayName = self.options.title;
            self.objId = self.options.objId;
            self.objType = self.options.objType;
            self.context = self.activity.context;
            self.tabView = false;
        },

        initializeRequiredContainers: function(){
            var me = this;
            me.tabContainer =  me.$el.find('.configurationtabview').empty();
        },
        /**
         *  Renders the form view in a overlay.
         *  builds the tab layout view
         *  returns this object
         */
        render: function () {
            var me = this,
                deployConfigurationFormConf = new DeployConfigurationFormConf(this.context);
            me.headerText= "<span><div class='icon_error'></div> This will overwrite the existing settings on the selected Devices </span>";
            // construct the Device conf view form
            me.formWidget = new FormWidget({
                "elements": deployConfigurationFormConf.getValues({'title': me.deviceDisplayName, 'headerText' : me.headerText}),
                "container": this.el
            });
            me.formWidget.build();
            this.$el.addClass('security-management');
            me.initializeRequiredContainers();
           $.proxy(me.constructTabContainerAndUpdateCliXml(), me);

            return this;
        },

       /**
        *   Ledger display for XML and CLI configuration
        *   will be used in XMLCliConfigurationView.js also
        *
        *   returns string HTML
        */
        getConfigurationLegend : function(){
            var templateConf = {
                added: this.context.getMessage("device_view_configuration_added"),
                deleted: this.context.getMessage("device_view_configuration_deleted"),
                modified: this.context.getMessage("device_view_configuration_modified"),
                comments: this.context.getMessage("device_view_configuration_comments")
            };
            return Slipstream.SDK.Renderer.render(LegendTemplate, templateConf);
        },
       /**
        *   update iFrame src with latest job, after success or failure (once job completes)
        *   @params self object
        */
        constructTabContainerAndUpdateCliXml: function(){
            var self = this;
             // construct the tab container and render in to the device conf form region
            if(!self.tabView){

                self.tabView = new DeployConfTabView({
                    'context':self.context,
                    'tabContainer': self.tabContainer,
                    'activity': self,
                     objId: self.objId,
                     objType: self.objType,
                     deviceId:self.options.deviceId
                });
                 console.log(self.tabView);
            }
            // CLI configuration fetch
            $.ajax({
                url: self.tabView.tabs[0].content.confViewUrl,
                type: 'GET',
                dataType:"json",
                complete: function(data){
                    //update the CLI container with the HTML response
                    var confViewContainer = self.$el.find('.configurationtabcliview').empty();
                    // also include the Configuration Legend while displaying the response
                    confViewContainer.append(self.getConfigurationLegend()+'</br>'+data.responseText);
                    self.destroyProgressBar();
                    self.tabContainer.show();
                  //  self.unSubscribeNotification();
                }
            });
        },


        /**
         *  Destroy/Hide progress bar
         *
         */
        destroyProgressBar: function(){
            this.activity.progressBar.destroy();
        },
        close: function(){
            this.activity.scheduleConfigJobTriggered = false;
            this.destroyProgressBar();
        },
        /**
         *   destroy the overlay
         *   @params event(mouse, keyboard)
         */
        closeOverlay: function (event) {
            event.preventDefault();
            event.isPropagationStopped();
           
            this.activity.overlay.destroy();
        }

    });

    return previewConfigurationFormView;
});
