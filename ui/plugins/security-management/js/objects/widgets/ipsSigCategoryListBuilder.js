/**
 * ListBuilder for IPS Signature Category selection
 * 
 * @module IPSSigCategoryListBuilder
 * @author <dkumara@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'widgets/listBuilderNew/listBuilderWidget'
], function(Backbone, ListBuilder) {
    var defaultConf = {
        excludedTypes: []
    };
    var IPSSigCategoryListBuilder = Backbone.View.extend({
        /**
         * Provide required configuration for list builder.
         * 
         */
        initListBuilderConf: function() {
            var self = this;
            this.elements = {
                "availableElements": {
                    "getData": function() {
                        var THIS = this;
                        $.ajax({
                            type: 'GET',
                            url: "/api/juniper/sd/ips-signature-management/ips-signature-categories",
                            headers: {
                                "Accept": 'application/vnd.juniper.sd.ips-signature-management.ips-sig-categories+json;q=0.01;version=1'
                            },
                            processData: false,
                            contentType: false,
                            success: function(data, textStatus) {
                                var dataObj = data['ips-sig-categories']['ips-sig-category'];
                                var arr = [];
                                for (i = 0; i < dataObj.length; i++) {
                                    arr.push({
                                        'name': dataObj[i].name,
                                        'id': dataObj[i].name+"_jnpr"
                                    });
                                }
                                $(THIS).addRowData('id', arr);
                                var selArr = [];
                                var selectedElementsArr = self.options.selectedItems;
                                for (i = 0; i < selectedElementsArr.length; i++) {
                                    selArr.push({
                                        'name': selectedElementsArr[i].trim(),
                                        'id': selectedElementsArr[i].trim()+"_jnpr"
                                    });
                                }
                                if (selArr && selArr.length > 0) {
                                    self.selectItems(selArr);
                                }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                console.log("Failed to fetch protocols");
                            }
                        });
                    },
                    "jsonRoot": 'ips-sig-categories.ips-sig-category',
                    "totalRecords": function(data) {
                        return data['ips-sig-categories']['@total'];
                    }
                },
                "id": "list",
                "jsonId": "id",
                "height": '115px',
                "pageSize": 10000,
                "search": {
                    "columns": "name"
                },
                "loadonce": true,
                "columns": [{
                    "id": "id",
                    "name": "id",
                    "hidden": true
                }, {
                    "index": "name",
                    "name": "name",
                    "label": "Name",
                    "width": 200
                }]
            };
        },
        initialize: function(options) {
            this.context = options.context;
            this.conf = _.extend(defaultConf, options);
            this._listBuilder = null;
            this.initListBuilderConf();
            this.setListBuilderId(options);
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
        addAvailableItems: function(items) {
            if (this._listBuilder) {
                return this._listBuilder.addAvailableItems(items);
            }
        },
        getSelectedItems: function() {
            if (this._listBuilder) {
                return this._listBuilder.getSelectedItems();
            }
        }
    });

    return IPSSigCategoryListBuilder;
});