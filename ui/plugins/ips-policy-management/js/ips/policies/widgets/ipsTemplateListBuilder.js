/**
 * ListBuilder for Ips template selection
 * 
 * @module IPSTemplateListBuilder
 * @author Vinamra Jaiswal <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/listBuilderNew/listBuilderWidget',
    '../../../../../ips-policy-management/js/ips/common/constants/ipsPolicyManagementConstants.js'
], function (Backbone, ListBuilder,IPSPolicyManagementConstants) {
     var defaultConf = {
        excludedTypes: []
    };
    var IPSTemplateListBuilder = Backbone.View.extend({
        /**
         * Provide required configuration for list builder.
         * 
         */
        initListBuilderConf: function() {
            this.elements = {
                "availableElements": {
                "url": IPSPolicyManagementConstants.IPS_TEMPLATE_URL,
                "jsonRoot": 'ips-sig-sets.ips-sig-set',
                "totalRecords": function(data) {
                        return data['ips-sig-sets']['@total'];
                }

                },
                "ajaxOptions": {
                    "headers": {
                            "Accept": IPSPolicyManagementConstants.IPS_TEMPLATE_ACCEPT_HEADER
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
                },
                {
                    "index": "name",
                    "name": "name",
                    "label": "Name",
                    "width": 200

                }, {
                    "index": "domain-name",
                    "name": "domain-name",
                    "label": "Domain",
                    "width": 100
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
                    var selectedElementsArr= self.options.selectedItems;
                    if(selectedElementsArr && selectedElementsArr.length>0) {                          
                        self.selectItems(selectedElementsArr);
                    }
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
        getSelectedItems: function () {
            if (this._listBuilder) {
                return this._listBuilder.getSelectedItems();
            }
        }
    });

    return IPSTemplateListBuilder;
});
