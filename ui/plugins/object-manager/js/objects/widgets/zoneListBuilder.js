/**
 * ListBuilder for Zone selection
 *
 * @module ZoneListBuilder
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    '../../../../sd-common/js/common/widgets/baseNewListBuilder.js',
    '../conf/zoneListBuilderConfiguration.js',
    '../models/zoneListBuilderModel.js'
], function (Backbone, ListBuilder, ListBuilderConf, ListBuilderModel) {

    var ZoneListBuilder = ListBuilder.extend({

        initialize: function (options) {
            this.listBuilderModel = new ListBuilderModel();
            ListBuilder.prototype.initialize.call(this, options);
        },

        addDynamicFormConfig: function(elements) {
            var self = this;

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

            this.elements = this.addDynamicFormConfig(elements);
        },

        // Overwrite this method, as Zones have name only and the data structure is different.
        bindListBuilderEvents: function() {
            var self = this;
            var onChangeSelected = function (e, data){
                var names = [];
                if (data.event === self.UNSELECT_MODE || data.event === self.SELECT_MODE) {
                    for (var i=0; i<data.data.length; i++) {
                        names.push(data.data[i].name);
                    }
                } else if (data.event === self.SELECT_ALL_MODE || data.event === self.UNSELECT_ALL_MODE) {
                    names = data.data;
                }

                self.setRequestBody(names, data.event);

                self.listBuilderModel.save(null, {
                    success: function(model, response) {
                        self._listBuilder.reload();
                        // Custom function for item change
                        if (self.conf.onChange) {
                            self.conf.onChange();
                        }
                    },
                    error: function(model, response) {
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

        // Overwrite this method, as Zones have name only and the data structure is different.
        getAllIds: function(response) {
            if (response && response["zone-list"] && response["zone-list"].zones) {
                return response["zone-list"].zones.map(function(item) {
                    return item.name;
                });
            }
            return [];
        },
        setRequestBody: function (ids, selectMode) {
            this.listBuilderModel.clear();

            if (selectMode === this.UNSELECT_MODE || selectMode === this.UNSELECT_ALL_MODE) {
                this.listBuilderModel.setDeSelectMode();
            } else if (selectMode === this.SELECT_MODE || selectMode === this.SELECT_ALL_MODE) {
                this.listBuilderModel.setSelectMode();
            }
            // set request body
            this.setRequestBodyDetail(ids);

            return;
        },
        setRequestBodyDetail: function (names) {
            this.listBuilderModel.set({
                  "zone-list": {
                  "zones":names
                }
            });
        }
    });

    return ZoneListBuilder;
});