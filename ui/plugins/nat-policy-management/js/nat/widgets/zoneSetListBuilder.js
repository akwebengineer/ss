/**
 * ListBuilder for Portsets
 *
 * @module ZoneSetListBuilder
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
    var ZoneSetListBuilder = Backbone.View.extend({
        /**
         * Provide required configuration for list builder.
         * 
         */
        initListBuilderConf: function() {
            var self = this;

            var formatName = function (cellValue, options, rowObject) {
                if (cellValue != options.rowId && cellValue.indexOf("(set)") < 0) {
                    return (cellValue + " (set)");
                } else {
                    return cellValue;
                }
            };

            this.elements = {
                "availableElements": {
                     "getData" : function () {
                        var THIS = this;
                        $.ajax({
                            type: 'GET',
                            url: "/api/juniper/sd/policy-management/nat/policies/" + self.options.policyObj.id + "/zones",
                            headers: {
                                 "Accept": "application/vnd.juniper.sd.policy-management.nat.zones+json;version=1;q=0.01",
                                "contentType":"application/vnd.juniper.sd.policy-management.nat.zones+json;q=0.01;version=1"
                            },
                            processData: false,
                            contentType: false,
                            success: function(data, textStatus) {
                                var dataObj  = data['zones']['zone'];
                                var arr = [], zoneNames = [];
                                for(i=0;i<dataObj.length;i++) {
                                    arr.push({
                                        'name':dataObj[i].name,
                                        'id':dataObj[i].id?dataObj[i].id:dataObj[i].name
                                    });
                                    zoneNames.push(dataObj[i].name);
                                }
                                $(THIS).addRowData('id',arr);
                                var selectedElementsArr= self.options.selectedItems;
                                if(selectedElementsArr && selectedElementsArr.length>0) {
                                    if(arr.length == 0) {
                                        $(THIS).addRowData('id',selectedElementsArr);
                                    }
                                    else {
                                        var selectedButNotAdded = [];
                                        for(i=0;i<selectedElementsArr.length;i++) {
                                            if(zoneNames.indexOf(selectedElementsArr[i].name)==-1) {
                                                selectedButNotAdded.push(selectedElementsArr[i]);
                                            }
                                        }
                                         $(THIS).addRowData('id',selectedButNotAdded);
                                    } 
                                    self.selectItems(selectedElementsArr);   
                                }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                console.log("Failed to fetch zones");
                            }
                     });
                    },
                    "jsonRoot":"zones.zone",
                    "totalRecords": function(data) {
                        return data.zones['@total'];
                    }
                },
                "pageSize": 10000,
                "id": "zoneList",
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
                    "width": 150,
                    "formatter": formatName
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

    return ZoneSetListBuilder;
});
