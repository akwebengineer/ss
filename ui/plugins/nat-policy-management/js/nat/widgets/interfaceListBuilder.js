/**
 * ListBuilder for Portsets
 *
 * @module InterfaceListBuilder
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
    var InterfaceListBuilder = Backbone.View.extend({
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
                            url: "/api/juniper/sd/policy-management/nat/policies/" + self.options.policyObj.id + "/interfaces",
                            headers: {
                                "Accept": "application/vnd.juniper.sd.policy-management.nat.interfaces+json;version=1;q=0.01",
                                "contentType":"application/vnd.juniper.sd.policy-management.nat.interfaces+json;q=0.01;version=1"
                            },
                            processData: false,
                            contentType: false,
                            success: function(data, textStatus) {
                                var dataObj  = data['interfaces']['interface'];
                                var arr = [];
                                for(i=0;i<dataObj.length;i++) {
                                    arr.push({
                                        'name':dataObj[i],
                                        'id':self.convertToValidId(dataObj[i])
                                    });
                                }
                                $(THIS).addRowData('id',arr);
                               
                               var selectedElementsArr= self.options.selectedItems;
                                if(selectedElementsArr && selectedElementsArr.length>0) {
                                    var selectedObjects = [];
                                    for(i=0;i<selectedElementsArr.length;i++) {
                                        if(selectedElementsArr[i]!=undefined && selectedElementsArr[i]!=""){
                                            selectedObjects.push({
                                                'name':selectedElementsArr[i],
                                                'id': self.convertToValidId(selectedElementsArr[i])
                                            });
                                        }    
                                    }
                                    if(arr.length == 0) {
                                        $(THIS).addRowData('id',selectedObjects);
                                    }
                                    else {
                                        var selectedButNotAdded = [];
                                        for(i=0;i<selectedElementsArr.length;i++) {
                                            if(dataObj.indexOf(selectedElementsArr[i])==-1) {
                                                selectedButNotAdded.push({
                                                'name':selectedElementsArr[i],
                                                'id':self.convertToValidId(selectedElementsArr[i])
                                                });
                                            }
                                        }
                                        $(THIS).addRowData('id',selectedButNotAdded);    
                                    }        
                                    self.selectItems(selectedObjects);
                                }

                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                console.log("Failed to fetch interfaces");
                            }
                     });
                    },
                    "jsonRoot":"interfaces.interface",
                    "totalRecords": function(data) {
                        return data.interfaces['@total'];
                    }
                },
                "pageSize": 10000,
                "id": "interfaceList",
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
                    "width": 150
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
        },
        convertToValidId : function(value) {
            return value.replace(/\//g, "-").replace(/\./g,"-");
        }
    });

    return InterfaceListBuilder;
});
