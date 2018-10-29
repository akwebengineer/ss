/**
 * A view that uses the Tab Container Widget to render a tab container.
 *
 * @module deployConfigurationTabContainer View
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    './useFwdeployXmlCliConfView.js',
    '../../../../sd-common/js/publish/views/deviceConfigurationTabView.js'
],  function (
        XmlCliView,
        DeviceConfigurationTabView) {

        var TabContainerView = DeviceConfigurationTabView.extend({

            updateTabs: function(){
             // construct each tab body
             this.tabs = [{
                  id:"cliConfiguration",
                  name:"CLI",
                  content: new XmlCliView({'activity': this, context:this.context, isXml: false, jobId: this.options.jobId, objType: this.options.objType})
             },{
                 id:"xmlConfiguration",
                 name:"XML",
                 content: new XmlCliView({'activity': this, context: this.context, isXml: true, jobId: this.options.jobId })
             }];
            }

        });

    return TabContainerView;
});