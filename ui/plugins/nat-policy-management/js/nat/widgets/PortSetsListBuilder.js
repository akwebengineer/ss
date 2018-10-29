/**
 * ListBuilder for Portsets
 *
 * @module PortSetsListBuilder
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'widgets/listBuilderNew/listBuilderWidget',
    '../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function (Backbone, ListBuilder, NATPolicyManagementConstants) {
     var defaultConf = {
        excludedTypes: []
    };
    var PortSetsListBuilder = Backbone.View.extend({
        /**
         * Provide required configuration for list builder.
         * 
         */
        initListBuilderConf: function() {
            var self = this;
            this.elements = {
                 "availableElements": {
                     "getData" : function () {
                        var THIS = this;
                        $.ajax({
                            type: 'GET',
                            url: NATPolicyManagementConstants.PORT_SETS_URL,
                            headers: {
                                "Accept": NATPolicyManagementConstants.PORT_SETS_ACCEPT_HEADER,
                                "contentType":NATPolicyManagementConstants.PORT_SETS_ACCEPT_HEADER
                    
                            },
                            processData: false,
                            contentType: false,
                            success: function(data, textStatus) {
                                var dataObj  = data['port-sets']['port-set'];
                               
                                $(THIS).addRowData('id',dataObj);
                                var selectedElementsArr= self.options.selectedItems;
                                if(selectedElementsArr && selectedElementsArr.length>0) { 
                                    //Populating ports column for validating port count
                                    var availableElementsArr = dataObj;
                                    var selectItems = [];
                                    for(var i=0; i< selectedElementsArr.length; i++) {
                                        for(var j=0;j<availableElementsArr.length;j++) {
                                            if(selectedElementsArr[i].id == availableElementsArr[j].id) {
                                                selectItems.push(availableElementsArr[j]);
                                                break;
                                            }
                                        }
                                    }                         
                                    self.selectItems(selectItems);
                                }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                console.log("Failed to fetch port sets");
                            }
                     });
                    },
                    "jsonRoot":"port-sets.port-set",
                    "totalRecords": function(data) {
                        return data['port-sets']['@total'];
                    }
                },
                "pageSize": 10000,
                "id": "list",
                "jsonId": "id",
                "height": '115px',
                "search": {
                    "columns": "name"
                },
                "loadonce": true, //only load remotely once
                "columns": [
                {
                    "id": "id",
                    "name": "id",
                    "hidden": true
                }, {
                    "index": "name",
                    "name": "name",
                    "label": "Name",
                    "width": 175
                },
                {
                    "index": "ports",
                    "name": "ports",
                    "hidden": true,
                    "label":"Ports"
                }]
            };
        },
        initialize: function(options) {
            this.context = options.context;
            this.conf = _.extend(defaultConf, options);
            this._listBuilder = null;
            this.initListBuilderConf();
            this.setListBuilderId(options);
            this.bindListBuilderEvents();
        },
        setListBuilderId: function(options) {
            if (options.id) {
                this.elements.id = options.id;
            }
        },
        build: function(callback) {
            var self = this;
            self.buildCallback = callback;
            self.renderListBuilder();
            return this;
        },
        renderListBuilder: function() {
            this._listBuilder = new ListBuilder({
                container: this.conf.container,
                elements: this.elements
            });
            this._listBuilder.build();
        },
        selectItems: function(items) {
            if (this._listBuilder) {
                return this._listBuilder.selectItems(items);
            }
        },
        bindListBuilderEvents : function() {
            var self = this;
             var onBuildListBuilder = function (e, listBuilder){                    
                    
                    if (self.buildCallback) {
                        self.buildCallback();
                    }
            };
            _.extend(this.elements, {
                onBuildListBuilder: onBuildListBuilder
            });
        },
        addAvailableItems: function (items) {
            if (this._listBuilder) {
                return this._listBuilder.addAvailableItems(items);
            }
        },
        getAvailableItems : function() {
            if (this._listBuilder) {
                return this._listBuilder.getAvailableItems();
            }
        },

        getSelectedItems: function () {
            if (this._listBuilder) {
                return this._listBuilder.getSelectedItems();
            }
        }
    });

    return PortSetsListBuilder;
});
