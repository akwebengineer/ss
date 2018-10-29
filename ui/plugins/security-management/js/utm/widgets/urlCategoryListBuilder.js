/**
 * ListBuilder for URL Category selection
 *
 * @module UrlCategoryListBuilder
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    '../../../../sd-common/js/common/widgets/baseNewListBuilder.js',
    '../conf/urlCategoryListBuilderConfiguration.js',
    '../models/urlCategoryListBuilderModel.js'
], function (Backbone, ListBuilder, ListBuilderConf, ListBuilderModel) {

    var UrlCategoryListBuilder = ListBuilder.extend({

        initialize: function (options) {
            this.listBuilderModel = new ListBuilderModel();
            ListBuilder.prototype.initialize.call(this, options);
        },

        addDynamicFormConfig: function(elements) {
            var self = this, filterItems = [];
            if(! $.isEmptyObject(self.conf.excludedProfileType)){
                filterItems.push({
                    property: 'profileType',
                    modifier: 'ne',
                    value: self.conf.excludedProfileType
                });
            }
            if(! $.isEmptyObject(filterItems)){
                elements.availableElements.urlParameters = {filter: self.getFilterUrl(filterItems)};
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

            var formConfiguration = new ListBuilderConf(this.context);
            var elements = formConfiguration.getValues(this.listBuilderModel);

            this.elements = this.addDynamicFormConfig(elements);
        },

        /**
         * Only show url categories with specific profile-type
         * @param [String] profileType - If profileType is undefined, clear filters (show all).
         * We support 2 profile types by now:
         * "CUSTOM" - Custom URL Categories
         * "JUNIPER_ENHANCED" - Websense URL Categories
         */
        filterByTypes: function(profileType, modifier) {
            var filter = null;
            if (profileType) {
                filter = {
                    property: "profileType",
                    modifier: modifier ? modifier : "eq",
                    value: profileType
                };
            }
            this.setFilter(filter);
        },

        setFilter: function(filter, connective) {
            var currentPara = this.getAvailableUrlParameter(),
                self = this,
                filterUrl = this.getFilterUrl(filter, connective);

            if (filterUrl) {
                _.extend(currentPara, {filter: filterUrl});
            } else {
                delete currentPara.filter;
            }

            self.searchAvailableItems(currentPara);
        }
    });

    return UrlCategoryListBuilder;
});