/**
 * ListBuilder for IPS Sig Service selection
 * 
 * @module IPSSigServiceListBuilder
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
    var IPSSigServiceListBuilder = Backbone.View.extend({
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
                            url: "/api/juniper/sd/ips-signature-management/ips-signature-services",

                            headers: {
                                "Accept": 'application/vnd.juniper.sd.ips-signature-management.ips-sig-services+json;version=1;q=0.01'

                            },
                            processData: false,
                            contentType: false,
                            success: function(data, textStatus) {
                                var dataObj = data['ips-sig-services']['ips-sig-service'];
                                var arr = [];
                                for (i = 0; i < dataObj.length; i++) {
                                    arr.push({
                                        'name': dataObj[i],
                                        'id': dataObj[i]
                                    });
                                }
                                $(THIS).addRowData('id', arr);
                                var selArr = [];
                                var selectedElementsArr = self.options.selectedItems;
                                for (i = 0; i < selectedElementsArr.length; i++) {
                                    selArr.push({
                                        'name': selectedElementsArr[i].trim(),
                                        'id': selectedElementsArr[i].trim()
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

                    "jsonRoot": 'ips-sig-services.ips-sig-service',
                    "totalRecords": function(data) {
                        return data['ips-sig-services']['@total'];
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

    return IPSSigServiceListBuilder;
});