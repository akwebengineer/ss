/**
 * ListBuilder for VPN devices selection
 *
 * @module VpnDevicesListBuilder
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    '../../../../sd-common/js/common/widgets/baseNewListBuilder.js',
    '../conf/vpnDevicesListBuilderConf.js',
    '../models/vpnDevicesListBuilderModel.js'
], function (Backbone, ListBuilder, ListBuilderConf, ListBuilderModel) {
    var VpnDevicesListBuilder = ListBuilder.extend({

        initialize: function (options) {
            this.listBuilderModel = new ListBuilderModel();
            this.queries = options.queries;

                if(options.id === 'vpn-endpoint-list'){
                    self.rootUrl = this.listBuilderModel.urlRoot;
                   this.listBuilderModel.typeofList = 'endpoint';
                }
                if(options.id === 'vpn-hub-list'){
                    this.listBuilderModel.urlRoot = self.rootUrl;
                    this.listBuilderModel.typeofList = 'hub';
                }
                ListBuilder.prototype.initialize.call(this, options);
        },
        addDynamicListBuilderConfig: function(elements) {

            if(! $.isEmptyObject(this.queries)){
                elements.availableElements.urlParameters = this.queries;
            }

            elements.search.url = function (currentPara, value){
                console.log(value);
                var updatedPara = {};
                if (value) {
                    updatedPara._search = value;
                } else {
                    delete currentPara._search;
                }
                return _.extend(currentPara, updatedPara);
            };

            return elements;
        },

        initListBuilderConf: function() {
            var self = this;

            var listBuilderConfiguration = new ListBuilderConf(this.context);
            var elements = listBuilderConfiguration.getValues(this.listBuilderModel);

            this.elements = this.addDynamicListBuilderConfig(elements);
        },
        /**
         * Only show url categories with specific profile-type
         * @param [String] profileType - If profileType is undefined, clear filters (show all).
         * We support 2 profile types by now:
         * "CUSTOM" - Custom URL Categories
         * "JUNIPER_ENHANCED" - Websense URL Categories
         */
        filterByTypes: function(profileType) {

            var currentPara = this.getAvailableUrlParameter(),
                self = this;

            if (profileType) {
                _.extend(currentPara, {deviceType: profileType});
            } else {
                delete currentPara.filter;
            }

            self.searchAvailableItems(currentPara);
        }
    });

    return VpnDevicesListBuilder;
});