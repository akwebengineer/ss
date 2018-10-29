/**
 * Model for listBuilder operation
 * 
 * @module VpnEndpointsListBuilderModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../../ui-common/js/models/baseListBuilderModel.js'
], function (BaseModel) {

    var VpnEndpointsListBuilderModel = BaseModel.extend({
        baseUrl: '/api/juniper/sd/vpn-management/vpn-ui/item-selector/',
        availableUrl: '/available-devices',
        selectedUrl: '/selected-devices',
        selectedHubUrl: '/selected-devices-hub',
        availableAccept: "application/vnd.juniper.sd.vpn-management.device-refs+json;version=1;q=0.01",
        selectAccept: "application/vnd.juniper.sd.vpn-management.device-refs+json;version=1;q=0.01",
        selectContentType: "application/vnd.juniper.sd.vpn-management.item-selector.device-ids+json;version=1;charset=UTF-8",
        deselectContentType: "application/vnd.juniper.sd.vpn-management.item-selector.device-ids+json;version=1;charset=UTF-8",
        // use for getting selectAll and unselectAll ids
        availableAllUrl: '/available-device-ids',
        selectedAllUrl: '/selected-device-ids',
        selectedAllHubUrl: '/selected-device-ids-hub',
        availableAllAccept: 'application/vnd.juniper.sd.vpn-management.device-ids+json;version=1;q=0.01',
        selectAllAccept: 'application/vnd.juniper.sd.vpn-management.device-ids+json;version=1;q=0.01',
        selectUrl: '/select',
        selectHubUrl: '/select-hub',
        deselectUrl: '/deselect',

        isGetSelectedItemsFromStoreAsync: false,
        getSelectURL: function () {
                var self = this;
                if (this.selectUrl){
                    if(self.typeofList === 'hub'){
                        return this.urlRoot + this.selectHubUrl;
                    }else{
                        return this.urlRoot + this.selectUrl;
                    }

                }else{
                    return this.urlRoot;
                }

        },
        getSelectedUrl: function() {
                var self = this;
                if(self.typeofList === 'hub'){
                    return this.urlRoot + this.selectedHubUrl;
                }else{
                   return this.urlRoot + this.selectedUrl;
                }
        },
        getSelectedAllUrl: function() {
            var self = this;
            if(self.typeofList === 'hub'){
               return this.urlRoot + this.selectedAllHubUrl;
            }else{
               return this.urlRoot + this.selectedAllUrl;
            }
        },
    });

    return VpnEndpointsListBuilderModel;
});