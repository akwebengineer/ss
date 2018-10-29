/**
 * A Backbone model representing Device-template collection (/api/space/config-template-management/config-templates/).
 *
 * @module DeviceTemplateCollection
 * @author Vivke Kumar <vkumar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/models/spaceCollection.js',
    './deviceTemplatesModel.js',
    '../common/constant/deviceTemplatesConstant.js'
], function (
    SpaceCollection,
    DeviceTemplatesModel,
    DeviceTemplatesConstants
) {
    /** 
     * DeviceTemplatesCollection definition.
     */
    var DeviceTemplateCollection = SpaceCollection.extend({
        url: function(filter) {
            var baseUrl = DeviceTemplatesConstants.DEVICE_TEMPLATE_URL;
            if (filter) {
                    return baseUrl + "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }        

            return baseUrl;
        },        
        model: DeviceTemplatesModel,

        /** 
         * Derrived class constructor method
         * Provide following while deriving a collection from base collection:
         * jsonRoot: for wrapping collection's json before sending back in ReST call
         * accept: accept request header in request header in ReST call
         */
        initialize: function() {

            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                jsonRoot: 'config-templates.config-template',
                accept: DeviceTemplatesConstants.DEVICE_TEMPLATE_ACCEPT_HEADER
            });
        }
    });

    return DeviceTemplateCollection;
});
