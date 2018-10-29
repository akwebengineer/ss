/**
 * A view that uses the Tab Container Widget to render a tab container.
 *
 * @module deployConfigurationTabContainer View
 * @author svaibhav
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    './deployXmlCliConfigurationView.js',
    '../../../../../sd-common/js/publish/views/deviceConfigurationTabView.js'
],  function (
        XmlCliView,
        DeviceConfigurationTabView) {

        var TabContainerView = DeviceConfigurationTabView.extend({

            updateTabs: function(){
             // construct each tab body
             this.tabs = [{
                  id:"cliConfiguration",
                  name:"CLI",
                  content: new XmlCliView({'activity': this, context:this.context, isXml: false, objId: this.options.objId, objType: this.options.objType,deviceId: this.options.deviceId})
             },{
                 id:"xmlConfiguration",
                 name:"XML",
                 content: new XmlCliView({'activity': this, context: this.context, isXml: true, objId: this.options.objId,objType: this.options.objType,deviceId: this.options.deviceId })
             }];
            }

        });

    return TabContainerView;
});