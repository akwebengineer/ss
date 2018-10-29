/**
 * ListBuilder for addresses
 *
 * @module AddressListBuilder
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'widgets/overlay/overlayWidget',
    '../../../../sd-common/js/common/widgets/baseNewListBuilder.js',
    '../conf/addressListBuilderConfiguration.js',
    '../models/addressListBuilderModel.js',
    '../views/addressObjectTreeView.js'
], function (Backbone, OverlayWidget, ListBuilder, ListBuilderConf, ListBuilderModel, TreeView) {
    // address type
    var IPADDRESS = 'IPADDRESS',
        DNS = 'DNS',
        RANGE = 'RANGE',
        NETWORK = 'NETWORK',
        WILDCARD = 'WILDCARD',
        GROUP = 'GROUP',
        POLYMORPHIC = 'POLYMORPHIC',
        DYNAMIC_ADDRESS_GROUP = 'DYNAMIC_ADDRESS_GROUP',
        ANY = 'ANY',
        ANY_IPV4 = 'ANY_IPV4', 
        ANY_IPV6 = 'ANY_IPV6',
        HOST = "HOST",
        OTHER = "OTHER";
    var ALL_TYPES = [HOST, NETWORK, RANGE, WILDCARD, POLYMORPHIC, DYNAMIC_ADDRESS_GROUP, GROUP, ANY, ANY_IPV4, ANY_IPV6];

    var AddressListBuilder = ListBuilder.extend({

        initialize: function (options) {
            this.listBuilderModel = new ListBuilderModel();
            ListBuilder.prototype.initialize.call(this, options);
        },

        addDynamicFormConfig: function(elements) {
            var self = this;
            // Initialize the available list and selected list if some address types need to be excluded
            var filterParameter = this.getInitialFilterParameter();
            // Initialize the address type filters in the list builder
            var filterItems = this.getFilterItems(this.conf.excludedTypes);

            if (filterParameter) {
                elements.availableElements.urlParameters = {filter: filterParameter};
            }

            if (filterItems && filterItems.length > 0) {
                elements.search.optionMenu = filterItems;
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
            }

            return elements;
        },

        initListBuilderConf: function() {
            var self = this;

            var formConfiguration = new ListBuilderConf(this.context);
            var elements = formConfiguration.getValues(this.listBuilderModel);

            this.elements = this.addDynamicFormConfig(elements);
        },

        rowTooltip: function (rowData, renderTooltip){
            var self = this;
            this.listBuilderModel.fetchById(rowData.id, function(model, response, options) {
                var data = response.address,
                    tipData = [];

                if (data) {
                    tipData.push({
                        title: data.name
                    });

                    if (data["address-type"] === GROUP) {
                        var members = response.address.members.member;
                        if (members) {
                              for (var i=0; i<members.length; i++) {
                                  if (members[i]["address-type"] === GROUP) {
                                      members[i]["ip-address"] = self.context.getMessage('tooltip_address_group');
                                  }
                                  var value = members[i]["ip-address"] || members[i]["host-name"];
                                  tipData.push({
                                      label: members[i].name + ": " + value
                                  });
                                  if (i == 4) {
                                      break;
                                  }
                              }
                              // Show a more link if more than 5 addresses in tooltip
                              var linkId = "address-tooltip-more-link";
                              if (self.conf.id) {
                                  linkId = self.conf.id + "-tooltip-more-link";
                              }

                              if (members.length > 5) {
                                  tipData.push({
                                      link: self.context.getMessage('tooltip_more_link', [members.length - 5]),
                                      id: linkId
                                  });
                              }

                              renderTooltip(tipData);

                              // Bind click event for "more" link
                              if (members.length > 5) {
                                  var link = $('#' + linkId);
                                  link.click($.proxy(self.moreLinkAction, self, link, data.id, data.name));
                              }
                        }
                    } else {
                        tipData.push({
                            label: data["ip-address"] || data["host-name"]
                        });
                        renderTooltip(tipData);
                    }
                }
            });
        },

        moreLinkAction: function(link, id, name) {
            /**
             * Hide tooltip immediately once "moreLink" is clicked.
             * "grid-widget" is the css class that added to tooltip container in tooltipBuilder
             */ 
            $(link).parentsUntil(".grid-widget", ".tooltipster-content").hide();
            if (!$.isEmptyObject(link)) {
                link.unbind('click');
            }
            this.tooltipOverlay = new OverlayWidget({
                view: new TreeView({parentView: this, ObjId: id, ObjName: name}),
                type: 'medium',
                showScrollbar: true
            });
            this.tooltipOverlay.build();
        },

        getInitialFilterParameter: function() {
            var filterArr = this.excludeAddressByType(this.conf.excludedTypes);
            if(this.conf.excludedNames && this.conf.excludedNames.length > 0){
                filterArr = filterArr.concat(this.excludeAddressByName(this.conf.excludedNames));
            }
            return this.getFilterUrl(filterArr);
        },

        addExcludedTypes: function(value, excludeTypeArr) {
            switch(value) {
                case HOST:
                    excludeTypeArr.push(IPADDRESS);
                    excludeTypeArr.push(DNS);
                    break;
                case NETWORK:
                case RANGE:
                case WILDCARD:
                case POLYMORPHIC:
                case DYNAMIC_ADDRESS_GROUP:
                    excludeTypeArr.push(value);
                    break;
                default:
                    if (value) {
                        var others = value.split(",");
                        for (var i=0; i<others.length; i++) {
                            excludeTypeArr.push(others[i]);
                        }
                    }
            }
        },
        handleFilter: function(filters, value, self) {
            var excludeTypeArr = [];

            if (value && value.length > 0) {
                for (var i=0; i<filters.length; i++) {
                    if (value.indexOf(filters[i].value) === -1) {
                        this.addExcludedTypes(filters[i].value, excludeTypeArr);
                    }
                }
            }

            excludeTypeArr = excludeTypeArr.concat(this.conf.excludedTypes);
            var filterArr = this.excludeAddressByType(excludeTypeArr);
            if(this.conf.excludedNames && this.conf.excludedNames.length > 0){
                filterArr = filterArr.concat(this.excludeAddressByName(this.conf.excludedNames));
            }

            return this.getFilterUrl(filterArr);
        },
        getFilterItems : function(exceptionArray){
          var items = [],
              otherTypeVal = [],
              // In SD, "Other" is a subset of "GROUP, ANY, ANY_IPV4, ANY_IPV6"
              OTHER_TYPES = [GROUP, ANY, ANY_IPV4, ANY_IPV6];

          // "HOST" filter
          if (exceptionArray.length === 0 || exceptionArray.indexOf(HOST) < 0) {
              items.push({
                  label: this.context.getMessage('address_type_host'),
                  value: HOST,
                  key: HOST,
                  type: "checkbox",
                  selected: false
              });
          }
          // "Network" filter
          if (exceptionArray.length === 0 || exceptionArray.indexOf(NETWORK) < 0) {
              items.push({
                  label: this.context.getMessage('address_type_network'),
                  value: NETWORK,
                  key: NETWORK,
                  type: "checkbox",
                  selected: false
              });
          }
          // "Range" filter
          if (exceptionArray.length === 0 || exceptionArray.indexOf(RANGE) < 0) {
              items.push({
                  label: this.context.getMessage('address_type_range'),
                  value: RANGE,
                  key: RANGE,
                  type: "checkbox",
                  selected: false
              });
          }
          // "Wildcard" filter
          if (exceptionArray.length === 0 || exceptionArray.indexOf(WILDCARD) < 0) {
              items.push({
                  label: this.context.getMessage('address_type_wildcard'),
                  value: WILDCARD,
                  key: WILDCARD,
                  type: "checkbox",
                  selected: false
              });
          }
          // "Variable" filter
          if (exceptionArray.length === 0 || exceptionArray.indexOf(POLYMORPHIC) < 0) {
              items.push({
                  label: this.context.getMessage('address_type_polymorphic'),
                  value: POLYMORPHIC,
                  key: POLYMORPHIC,
                  type: "checkbox",
                  selected: false
              });
          }
          // "Dynamic Address" filter
          if (exceptionArray.length === 0 || exceptionArray.indexOf(DYNAMIC_ADDRESS_GROUP) < 0) {
              items.push({
                  label: this.context.getMessage('address_type_dynamic_address'),
                  value: DYNAMIC_ADDRESS_GROUP,
                  key: DYNAMIC_ADDRESS_GROUP,
                  type: "checkbox",
                  selected: false
              });
          }
          // "Other" filter
          for (var i=0; i<ALL_TYPES.length; i++) {
              if (exceptionArray.indexOf(ALL_TYPES[i]) < 0 && OTHER_TYPES.indexOf(ALL_TYPES[i]) !== -1) { 
                  otherTypeVal.push(ALL_TYPES[i]);
              }
          }
          if (otherTypeVal.length > 0) {
              items.push({
                  label: this.context.getMessage('address_type_other'),
                  value: otherTypeVal.join(),
                  key: otherTypeVal.join(),
                  type: "checkbox",
                  selected: false
              });
          }

          return items;
        },

       excludeAddressByType: function(typeArr) {
           var filterArr = [];

           for (var i=0; i<typeArr.length; i++)
           {
               var urlFilter = {
                   property: 'addressType',
                   modifier: 'ne',
                   value: typeArr[i]
               };
               filterArr.push(urlFilter);
           }

           return filterArr;
       },

       excludeAddressByName: function(nameArr) {
           var filterArr = [];
           for (var i=0; i<nameArr.length; i++)
           {
               var urlFilter = {
                   property: 'name',
                   modifier: 'ne',
                   value: nameArr[i]
               };
               filterArr.push(urlFilter);
           }
           return filterArr;
       },

       /**
        * Reset list builder to its initial status
        *
        */
       resetFilter: function() {
           // Get initial filters
           var filterArr = this.excludeAddressByType(this.conf.excludedTypes);
           if (this.conf.excludedNames && this.conf.excludedNames.length > 0){
               filterArr = filterArr.concat(this.excludeAddressByName(this.conf.excludedNames));
           }
           this.setFilter(filterArr);
       }
    });

    return AddressListBuilder;
});
