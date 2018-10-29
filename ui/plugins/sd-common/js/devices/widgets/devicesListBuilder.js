/**
 * ListBuilder for devices selection
 *
 * @module DevicesListBuilder
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    '../../common/widgets/baseNewListBuilder.js',
    '../conf/devicesListBuilderConfiguration.js',
    '../models/devicesListBuilderModel.js'
], function(Backbone, ListBuilder, ListBuilderConf, ListBuilderModel) {
   var DevicesListBuilder = ListBuilder.extend({

        initialize: function (options) {
            this.listBuilderModel = new ListBuilderModel();
            ListBuilder.prototype.initialize.call(this, options);
        },

        addDynamicFormConfig: function(elements) {
            var self = this;
            // Initialize the available list and selected list if some devices need to be excluded
            var filterParameter = this.getInitialFilterParameter();
            // Initialize the filters in the list builder
            var filterItems = this.getFilterItems(null);

            if (filterParameter) {
                elements.availableElements.urlParameters = {filter: filterParameter};
                elements.selectedElements.urlParameters = {filter: filterParameter};
            }

            elements.search.url = function (currentPara, value){
                    console.log(value);
                    var filterUrl;
                    if (_.isArray(value)){
                        filterUrl = self.handleFilter(this.optionMenu, value, self);
                        return _.extend(currentPara, {filter: filterUrl});
                    } else {
                        var updatedPara = {};
                        if (value) {
                            updatedPara._search = value;
                        } else {
                            delete currentPara._search;
                        }
                        return _.extend(currentPara, updatedPara);
                    }
                };

            return elements;
        },

        initListBuilderConf: function() {
            var self = this;

            var formConfiguration = new ListBuilderConf(this.context);
            var elements = formConfiguration.getValues(this.listBuilderModel);

            this.elements = this.addDynamicFormConfig(elements);
        },

        getInitialFilterParameter: function() {
            var filterArr = [];
            return this.getFilterUrl(filterArr);
        },

        handleFilter: function(filters, value, self) {
            return this.getFilterUrl(null);
        },
        getFilterItems : function(exceptionArray){
          return null;
        }
    });

    return DevicesListBuilder;
});