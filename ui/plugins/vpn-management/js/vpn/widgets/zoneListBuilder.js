/**
 * ListBuilder for Zone selection
 *
 * @module ZoneListBuilder
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/
define([
    'backbone',
    '../../../../sd-common/js/common/widgets/baseNewListBuilder.js',
    '../conf/protectedZoneListBuilderConfiguration.js',
    '../models/protectedZoneListBuilderModel.js'
], function (Backbone, ListBuilder, ListBuilderConf, ListBuilderModel) {
    var isSetFilter = false;
    var ZoneListBuilder = ListBuilder.extend({

        initialize: function (options) {
            this.listBuilderModel = new ListBuilderModel();
            ListBuilder.prototype.initialize.call(this, options);
        },

        addDynamicFormConfig: function(elements) {
            var self = this;

            elements.availableElements.urlParameters = this.conf.urlParameters;

            elements.search.url = function (currentPara, value){
                console.log(value);
                var updatedPara = {};
                if (value) {
                    updatedPara._search = value;
                } else {
                    delete currentPara._search;
                }
                return _.extend(currentPara, updatedPara);
            };

            return elements;
        },

        initListBuilderConf: function() {
            var self = this;

            var formConfiguration = new ListBuilderConf(this.context);
            var elements = formConfiguration.getValues(this.listBuilderModel);
            this.context.uuiD = self.conf.urlParameters['ui-session-id'];
            this.elements = this.addDynamicFormConfig(elements);
        },

        // Overwrite this method, as Zones have name only and request body data structure is different.

        bindListBuilderEvents: function() {
            var self = this;
            var onChangeSelected = function (e, data){
                var names = [];
                var contentType;
                var url;
                var selectMode = data.event;

                if (selectMode  === self.UNSELECT_MODE || selectMode  === self.SELECT_MODE) {
                    for (var i=0; i<data.data.length; i++) {
                        names.push({name:data.data[i].name});
                    }
                } else if (selectMode === self.SELECT_ALL_MODE || selectMode === self.UNSELECT_ALL_MODE) {
                    for (var i=0; i<data.data.length; i++) {
                        names.push({name:data.data[i]});
                    }
                };

                self.setRequestBody(names, selectMode);

                if (selectMode === self.UNSELECT_MODE || selectMode === self.UNSELECT_ALL_MODE) {
                    contentType = self.listBuilderModel.getDeSelectMode();
                    url = self.listBuilderModel.getDeSelectURL();
                } else if (selectMode === self.SELECT_MODE || selectMode === self.SELECT_ALL_MODE) {
                    contentType = self.listBuilderModel.getSelectMode();
                    url = self.listBuilderModel.getSelectURL();
                };

                $.ajax({
                    headers: {
                        'content-type': contentType
                    },
                    type: 'POST',
                    url: url,
                    dataType: "json",
                    data: JSON.stringify(self.listBuilderModel.toJSON()),
                    success: function(response, status) {
                        if (isSetFilter){
                            self.listBuilderModel.trigger('setFilter');
                        } else{
                          self._listBuilder.reload();
                        }

                        // Custom function for item change
                        if (self.conf.onChange) {
                            self.conf.onChange();
                        }
                    },
                    error: function() {
                        console.log("error");
                    }
                });
            };

            _.extend(this.elements, {
                onChangeSelected: onChangeSelected
            });


            var onDestroyListBuilder = function (e, listBuilder){
                console.log('the list builder is going to be destroyed');
                self.listBuilderModel.resetStore();
            };

            _.extend(this.elements, {
                onDestroyListBuilder: onDestroyListBuilder
            });


            var onBuildListBuilder = function (e, listBuilder){
                self.initialStore(self.conf.selectedItems, function() {
                    if (self.conf.selectedItems.length > 0) {
                        self._listBuilder.reload();
                    }
                    if (self.buildCallback) {
                        self.buildCallback();
                    }
                });
            };

            _.extend(this.elements, {
                onBuildListBuilder: onBuildListBuilder
            });

            var onSelectAll = function(done){
                self.listBuilderModel.getAvailableAllIds(function(response) {
                    var ids = self.getAllIds(response);
                    done({
                        ids: ids
                    });
                });
            };

            var onDeSelectAll = function(done){
                self.listBuilderModel.getSelectedAllIds(function(response) {
                    var ids = self.getAllIds(response);
                    done({
                        ids: ids
                    });
                });
            };

            this.elements.availableElements.onSelectAll = onSelectAll;
            this.elements.selectedElements.onSelectAll = onDeSelectAll;
        },


        // Overwrite this method, as list builder framework only requires an array of strings

        getAllIds: function(response) {
            if (response && response["name-list"] && response["name-list"].name) {
                return response["name-list"]["name"];
            } else {
                return [];
            }
        },

        // Overwrite this method, as strings are used instead of ids

        setRequestBody: function (names, selectMode) {
            this.listBuilderModel.clear();

            // Set the mode of the list builder

            if (selectMode === this.UNSELECT_MODE || selectMode === this.UNSELECT_ALL_MODE) {
                this.listBuilderModel.setDeSelectMode();
            } else if (selectMode === this.SELECT_MODE || selectMode === this.SELECT_ALL_MODE) {
                this.listBuilderModel.setSelectMode();
            }

            // set request body
            this.setRequestBodyDetail(names);

            return;
        },


        // Overwrite this method, as names are used instead of ids

        setRequestBodyDetail: function (names) {
            var nameList = [];

            names.forEach(function(object){
                nameList.push(object.name);
            });

            this.listBuilderModel.set({
                  "name-list": {
                  "name":nameList
                }
            });
        }
    });

    return ZoneListBuilder;
});