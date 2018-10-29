/**
 * ListBuilder for devices selection
 *
 * @module AssignDevicesListBuilder
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    '../../../../../sd-common/js/common/widgets/baseNewListBuilder.js',
    '../conf/assignDevicesListBuilderConfiguration.js',
    '../models/assignDevicesListBuilderModel.js'
], function(Backbone, ListBuilder, ListBuilderConf, ListBuilderModel) {
   var AssignDevicesListBuilder = ListBuilder.extend({

        policyModel:undefined,
        policyManagementConstants:undefined,

        initialize: function (options) {
            this.policyModel = options.policyModel;
            this.policyManagementConstants = options.policyManagementConstants;
            this.listBuilderModel = new ListBuilderModel({policyModel : this.policyModel,
                policyUrl : this.policyManagementConstants.POLICY_URL});
            ListBuilder.prototype.initialize.call(this, options);
        },

     /**
      * init the store on backend. This will load both LHS and RHS for the device selectors
      */
     beforeRenderListBuilderCallback: function() {
       var me = this;
       me.listBuilderModel.initStore($.proxy(me.renderListBuilder, me));
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

            if (filterItems && filterItems.length > 0) {
                elements.search.optionMenu = filterItems;
              //method to get for RHS filter url
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
                      return _.extend(currentPara, updatedPara);                    }
                };
            }

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

    return AssignDevicesListBuilder;
});