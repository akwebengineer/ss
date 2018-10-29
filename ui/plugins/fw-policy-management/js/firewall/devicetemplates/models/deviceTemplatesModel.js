/**
 * A Backbone model representing policy-profile (/api/space/config-template-management/config-templates).
 *
 * @module DeviceTemplateModel
 * @author Vivek Kumar <vkumar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/models/spaceModel.js',
    '../common/constant/deviceTemplatesConstant.js'
], function (SpaceModel, DeviceTemplatesConstants) {
    /**
     * DeviceTemplateModel definition.
     */
    var DeviceTemplateModel = SpaceModel.extend({

        urlRoot: DeviceTemplatesConstants.DEVICE_TEMPLATE_URL,

        initialize: function () {
            SpaceModel.prototype.initialize.call(this, {
                jsonRoot: 'config-template',
                accept: DeviceTemplatesConstants.DEVICE_TEMPLATE_CREATE_ACCEPT_HEADER,
                contentType: DeviceTemplatesConstants.DEVICE_TEMPLATE_CONTENT_HEADER
            });
        }
    });

    return DeviceTemplateModel;
});