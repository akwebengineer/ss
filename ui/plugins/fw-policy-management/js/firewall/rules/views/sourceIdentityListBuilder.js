/**
 * ListBuilder for Source Identity selection
 *
 * @module SourceIdentityListBuilder
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    '../../../../../sd-common/js/common/widgets/baseNewListBuilder.js',
    '../conf/sourceIDListBuilderConfiguration.js',
    '../models/sourceIDListBuilderModel.js'
], function (Backbone, ListBuilder, ListBuilderConf, ListBuilderModel) {
    var UNSELECT_MODE = "unselect";
    var SELECT_MODE = "select";
    var SELECT_ALL_MODE = "selectAll";
    var UNSELECT_ALL_MODE = "unselectAll";
    /**
     * SourceIdentityListBuilder definition.
     */
    var SourceIdentityListBuilder = ListBuilder.extend({

        initialize: function(options) {
            this.policyObj = options.policyObj;
            this.listBuilderModel = new ListBuilderModel(options);
            ListBuilder.prototype.initialize.call(this, options);
        },

        addDynamicFormConfig: function(elements) {
            var self = this;
            elements.search.url = function (currentPara, value){
               console.log(value);
               return _.extend(currentPara, {_search:value});
            };

            return elements;
        },

        initListBuilderConf: function(options) {
            var self = this;
            var formConfiguration = new ListBuilderConf(this.context);
            var elements = formConfiguration.getValues(this.listBuilderModel);
            this.elements = this.addDynamicFormConfig(elements);
        },

        // Overwrite this method, as Source identity have name only and the data structure is different.
        bindListBuilderEvents: function() {
            var self = this;
            var onChangeSelected = function (e, data){
                var names = [];
                if (data.event === UNSELECT_MODE || data.event === SELECT_MODE) {
                    if (_.isArray(data.data) && data.data.length > 0) {
                        for (var i=0; i<data.data.length; i++) {
                            names.push({"name": data.data[i].name});
                        }
                    }
                } else if (data.event === SELECT_ALL_MODE || data.event === UNSELECT_ALL_MODE) {
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
         
        // Overwrite this method, as Source identity have name only and the data structure is different.
        setRequestBody: function (names, selectMode) {
            this.listBuilderModel.clear();

            if (selectMode === UNSELECT_MODE || selectMode === UNSELECT_ALL_MODE) {
                this.listBuilderModel.setDeSelectMode();
            } else if(selectMode === SELECT_MODE || selectMode === SELECT_ALL_MODE){
                this.listBuilderModel.setSelectMode();
            }

            if (selectMode === undefined || selectMode === SELECT_ALL_MODE
                || selectMode === UNSELECT_ALL_MODE) {  // getting selected list from backend
                var nameArr = [];
                for (var i=0; i<names.length; i++) {
                    nameArr.push({"name": names[i]});
                }

                // set request body
                this.listBuilderModel.set({
                    "SrcIdentityList": {
                        "srcIdentities":nameArr
                    }
                });
            } else {  // getting list from list builder available or selected
                this.listBuilderModel.set({
                    "SrcIdentityList": {
                        "srcIdentities":names
                    }
                });
            }

            return;
        },

        getAllIds: function(response) {
            if (response && response["SrcIdentityList"] && response["SrcIdentityList"].srcIdentities) {
                var res = [];
                for (var i=0; i<response["SrcIdentityList"].srcIdentities.length; i++) {
                    res.push(response["SrcIdentityList"].srcIdentities[i].name);
                }
                return res;
            }
            return [];
        },
    });

    return SourceIdentityListBuilder;
});
