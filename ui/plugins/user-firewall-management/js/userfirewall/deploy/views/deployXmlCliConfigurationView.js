/**
 * A view that uses the form Widget to render a form from a configuration object
 * The configuration file contains the title, labels, element types, validation types and a iframe.
 *
 * @module deploy xmlcli config view
 * @author svaibhav
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    '../../../../../sd-common/js/publish/views/xmlcliConfigurationView.js',
    '../../constants/userFirewallConstants.js'
],  function(
        XMLCLIConfigurationView,UserFwConstatnts){

        var DeployXMLCLIConfView = XMLCLIConfigurationView.extend({

             updateConfigURL: function(){
                   if(this.isXml){
                     this.confViewUrl = UserFwConstatnts[this.options.objType].CONFIG_VIEW_URL.replace('{0}',this.options.objId).replace('{1}',this.options.deviceId);
                   }else{
                   this.confViewUrl = UserFwConstatnts[this.options.objType].CLI_CONFIG_VIEW_URL.replace('{0}',this.options.objId).replace('{1}',this.options.deviceId);
                   }
             }
        });

    return DeployXMLCLIConfView;

});