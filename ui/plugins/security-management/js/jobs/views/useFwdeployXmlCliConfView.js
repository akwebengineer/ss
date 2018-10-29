/**
 * A view that uses the form Widget to render a form from a configuration object
 * The configuration file contains the title, labels, element types, validation types and a iframe.
 *
 * @module deploy xmlcli config view
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    '../../../../sd-common/js/publish/views/xmlcliConfigurationView.js'
],  function(
        XMLCLIConfigurationView){

        var DeployXMLCLIConfView = XMLCLIConfigurationView.extend({

            updateConfigURL: function(){
                this.confViewUrl = '/api/juniper/sd/access-profile-management/job/'+this.options.jobId+'/config-preview';
                if(!this.isXml){
                    this.confViewUrl += '?cli=true&feature='+this.options.objType;
                }
            }
        });

    return DeployXMLCLIConfView;

});