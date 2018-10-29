/**
 * ListBuilder for Portsets
 *
 * @module ProtocolListBuilder
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'widgets/listBuilderNew/listBuilderWidget'
], function (Backbone, ListBuilder) {
     var defaultConf = {
        excludedTypes: []
    };
    var ProtocolListBuilder = Backbone.View.extend({
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
                            url: "/api/juniper/sd/service-management/protocols",
                            headers: {
                                 "Accept": "application/vnd.juniper.sd.service-management.protocols+json;version=1;q=0.01;",
                                 "contentType":"application/vnd.juniper.sd.service-management.protocols+json;version=1;q=0.01;"
                            },
                            processData: false,
                            contentType: false,
                            success: function(data, textStatus) {
                                var dataObj  = data['protocols']['protocols'];
                                var arr = [];
                                for(i=0;i<dataObj.length;i++) {
                                    arr.push({
                                        'name':dataObj[i].name,
                                        'id':dataObj[i].value
                                    });
                                }
                                $(THIS).addRowData('id',arr);
                                var selectedElementsArr= self.options.selectedItems;
                                    if(selectedElementsArr && selectedElementsArr.length>0) {
                                        self.selectItems(selectedElementsArr);
                                    }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                console.log("Failed to fetch protocols");
                            }
                     });
                    },
                "jsonRoot":"protocols.protocols" ,
                "totalRecords": function(data) {
                        return data['protocols']['@total'];
                }
                },
                "id": "list",
                "jsonId": "id",
                "height": '150px',
                "pageSize": 10000,
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

    return ProtocolListBuilder;
});
