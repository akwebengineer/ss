/**
 * A view that uses the form Widget to render a form from a configuration object
 * The configuration file contains the title, labels, element types, validation types and a iframe.
 *
 * @module xmlcli config view
 * @author vinay <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    '../conf/deviceViewConfigurationFormConf.js',
    'widgets/form/formWidget',
    '../constants/previewConfgConstants.js',
    '../../../../ui-common/js/common/utils/SmUtil.js'
],  function(Backbone,
        FormConf,
        FormWidget,
        PreviewConfgConstants,
        SmUtil){

        var DeviceConfView = Backbone.View.extend({
            /**
             *  Initialize all the view require params
             */
            initialize: function () {
                this.context = this.options.context;
                this.isXml = this.options.isXml;
                this.jobId = this.options.viewConfJobId;
                this.deviceMoId = this.options.deviceMoId;
                this.updateConfigURL();
            },

            updateConfigURL: function(){
               /**
                 *   build the URL for fetching the XML and CLI configuration.
                 */
                this.confViewUrl = new SmUtil().buildDynamicURL(PreviewConfgConstants.XML_CLI_CONF_VIEW_URL, [this.jobId ,this.options.selectedSecurityDeviceId])+"&settings="+(this.isXml ? "xmlConfiguration" : "cliConfiguration")+ ((this.deviceMoId)?("&devicemoid=" + this.deviceMoId) : "");
            },
            render: function () {

                var  me = this, conf = new FormConf(me.context), confViewContainer, frameId, iFrameData;
                /**
                 *   configuration is loaded based on the xml or cli view.
                 */
                me.form = new FormWidget({
                    "elements": me.isXml ?  conf.getXmlConf() : conf.getCliConf(),
                    "container": me.el,
                    "values": {}
                });
                me.form.build();
                 // update the XML container with HTML response
                 if(me.isXml){
                    confViewContainer = me.$el.find('.configurationtabxmlview').empty();
                     $.ajax({
                        url: me.confViewUrl,
                        type: 'GET',
                        dataType:"json",
                        complete: function(data, status){
                            // also include the Configuration Legend while displaying the response
                            var tabViewActivity = me.options.activity,
                                deviceConfViewActivity = tabViewActivity.activity;
                            // getConfigurationLegend is defined in deviceConfigurationFormView.js
                            // so fetch the activity and then append to the response.
                            confViewContainer.append(deviceConfViewActivity.getConfigurationLegend()+'</br>'+data.responseText);
                        }
                     });
                 }
                return me;
            }
        });

    return DeviceConfView;

});
