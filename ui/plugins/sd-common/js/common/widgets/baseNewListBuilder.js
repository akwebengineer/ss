/**
 * ListBuilder for basic use
 *
 * @module BaseListBuilder
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'widgets/listBuilderNew/listBuilderWidget'
], function (Backbone, ListBuilder) {
    var defaultConf = {
        excludedTypes: []
    },
    isSetFilter = false;

    var BaseListBuilder = Backbone.View.extend({
        SELECT_MODE: "select",
        UNSELECT_MODE: "unselect",
        SELECT_ALL_MODE: "selectAll",
        UNSELECT_ALL_MODE: "unselectAll",
        
        /**
         * Provide required configuration for list builder.
         * It should be overwritten.
         * 
         */
        initListBuilderConf: function() {
            this.elements = {};
        },

        initialStore: function(ids, callback) {
            var self = this;

            if (!ids || ids.length === 0) {
                if (callback) {
                    callback();
                }
                return;
            }

            this.setRequestBody(ids);

            return $.ajax({
                headers: {
                    'content-type': this.listBuilderModel.getSelectMode() 
                },
                type: 'POST',
                url: this.listBuilderModel.getSelectURL(),
                dataType: "json",
                data: JSON.stringify(this.listBuilderModel.toJSON()),
                success: function(response, status) {
                    console.log("success");
                    if (callback) {
                        callback();
                    }
                },
                error: function() {
                    console.log("error");
                    if (callback) {
                        callback();
                    }
                }
            });
        },
        initialize: function(options) {
            this.context = options.context;
            this.conf = _.extend({}, defaultConf, options);
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
      beforeRenderListBuilderCallback: function () {
          var self = this;
          self.renderListBuilder();
        },
        build: function(callback,resetStoreFlag) {
            var self = this;
            self.buildCallback = callback;
            /* resetStore method is called only when the store flag 
            is false from the child class */
          if(!resetStoreFlag) {
           this.listBuilderModel.resetStore($.proxy(self.beforeRenderListBuilderCallback, self));
          }
          else {
            self.beforeRenderListBuilderCallback();
          }
         return this;
        },

        renderListBuilder: function() {
            this._listBuilder = new ListBuilder({
                container: this.conf.container,
                elements: this.elements,
                rowTooltip: this.conf.rowTooltip || $.proxy(this.rowTooltip, this)
            });

            this._listBuilder.build();
        },

        rowTooltip: function(rowData, renderTooltip) {
            return;
        },

        bindListBuilderEvents: function() {
            var self = this;
            var onChangeSelected = function (e, data){
                var ids = [],
                    contentType,
                    url;
                if (data.event === self.UNSELECT_MODE || data.event === self.SELECT_MODE) {
                    if (_.isArray(data.data) && data.data.length > 0) {
                        if (data.data[0].id) {
                            for (var i=0; i<data.data.length; i++) {
                                ids.push(data.data[i].id);
                            } 
                        } else {
                            ids = data.data;
                        }
                    }
                } else if (data.event === self.SELECT_ALL_MODE || data.event === self.UNSELECT_ALL_MODE) {
                    ids = data.data;
                }

                self.setRequestBody(ids, data.event);
                if (data.event === self.UNSELECT_MODE || data.event === self.UNSELECT_ALL_MODE) {
                    contentType = self.listBuilderModel.getDeSelectMode();
                    url = self.listBuilderModel.getDeSelectURL();
                } else if (data.event === self.SELECT_MODE || data.event === self.SELECT_ALL_MODE) {
                    contentType = self.listBuilderModel.getSelectMode();
                    url = self.listBuilderModel.getSelectURL();
                }

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
                    if (self.conf.selectedItems && self.conf.selectedItems.length > 0) {
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
                var urlParam = self.getSelectedUrlParameter();
                urlParam = urlParam ? urlParam["_search"] : undefined;
                self.listBuilderModel.getSelectedAllIds(function(response) {
                    var ids = self.getAllIds(response);
                    done({
                        ids: ids
                    });
                }, urlParam);
            };
            this.elements.availableElements.onSelectAll = onSelectAll;
            this.elements.selectedElements.onSelectAll = onDeSelectAll;
        },

        /**
         * The method can be overwritten if response has a special data structure 
         * 
         */
        getAllIds: function(response) {
            if (response && response["id-list"] && response["id-list"].ids) {
                return response["id-list"].ids;
            }
            return [];
        },

        setRequestBody: function (ids, selectMode) {
            this.listBuilderModel.clear();

            // set request body
            this.setRequestBodyDetail(ids);

            return;
        },
        setRequestBodyDetail: function (ids) {
            this.listBuilderModel.set({
                "id-list": {
                    "ids":ids
                }
            });
        },
        /**
         * Get available items which are currently displaying in the available (the panel 1).
         * 
         * Note: If you have virtual scrolling in the panel 1, it will only return the displaying items.
         */
        getVisibleAvailableItems: function () {
            if (this._listBuilder) {
                return this._listBuilder.getAvailableItems();
            }
        },
        /**
         * Get all available items in the current available list (the panel 1).
         * 
         * @param {Function} callback - Callback to handle the response
         */
        getAvailableItems: function (callback) {
            return this.listBuilderModel.getAvailableItemsFromStore(callback);
        },
        addAvailableItems: function (items) {
            if (this._listBuilder) {
                return this._listBuilder.addAvailableItems(items);
            }
        },
        removeAvailableItems: function (items) {
            if (this._listBuilder) {
                return this._listBuilder.removeAvailableItems(items);
            }
        },
        /**
         * Get selected items which are currently displaying in the selected list (the panel 2).
         * 
         * Note: If you have virtual scrolling in the panel 2, it will only return the displaying items.
         */
        getVisibleSelectedItems: function() {
            if (this._listBuilder) {
                return this._listBuilder.getSelectedItems();
            }
        },
        /**
         * Get all selected items in the current selected list (the panel 2).
         * 
         * @param {Func} callback - Callback to handle the response
         */
        getSelectedItems: function(callback) {
            return this.listBuilderModel.getSelectedItemsFromStore(callback);
        },
        setSelectedItems: function(items) {
            if (this._listBuilder) {
                return this._listBuilder.selectItems(items);
            }
        },
        addSelectedItems: function (items) {
            if (this._listBuilder) {
                return this._listBuilder.addSelectedItems(items);
            }
        },
        removeSelectedItems: function (items) {
            if (this._listBuilder) {
                return this._listBuilder.removeSelectedItems(items);
            }
        },
        /**
         * Remove existing items from the selected column to the available column.
         * 
         */
        unselectItems: function(items) {
            if (this._listBuilder) {
                return this._listBuilder.unselectItems(items);
            }
        },
        /**
         * Move existing items from the available column to the selected column. 
         * 
         */
        selectItems: function(items) {
            if (this._listBuilder) {
                return this._listBuilder.selectItems(items);
            }
        },
        getAvailableUrlParameter: function () {
            if (this._listBuilder) {
                return this._listBuilder.getAvailableUrlParameter();
            }
        },
        getSelectedUrlParameter: function () {
            if (this._listBuilder) {
                return this._listBuilder.getSelectedUrlParameter();
            }
        },
        searchAvailableItems: function (currentPara) {
            if (this._listBuilder) {
                return this._listBuilder.searchAvailableItems(currentPara);
            }
        },
        searchSelectedItems: function (currentPara) {
            if (this._listBuilder) {
                return this._listBuilder.searchSelectedItems(currentPara);
            }
        },
        reload: function() {
            if (this._listBuilder) {
                return this._listBuilder.reload();
            }
        },
        refresh: function(callback) {
            var self = this;
            this.listBuilderModel.refreshStore(function() {
                self.reload();
                callback();
            });
        },
        destroy: function() {
            if (this._listBuilder) {
                return this._listBuilder.destroy();
            }
        },
        getFilterUrl: function(filter, connective) {
            var baseUrl = "";

            if (Array.isArray(filter)) {
                if (filter.length === 0) {
                    return baseUrl;
                }

                connective = connective || "and";
                // Multiple filters support
                var tmpUrl = baseUrl + "(";

                for (var i=0; i<filter.length; i++) {
                    tmpUrl += filter[i].property + " " + filter[i].modifier + " '" + filter[i].value + "'";
                    if (i !== filter.length-1) {
                        tmpUrl += " "+ connective +" ";
                    }
                }
                tmpUrl += ")";

                return tmpUrl;
            } else if (Object.prototype.toString.call(filter) === "[object String]") {
                return baseUrl + "(" + filter + ")";
            } else if (filter) {
                // single filter
                return baseUrl += "(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
            }

            return baseUrl;
        },
        /**
         * Reset the available items to the new filtered collection values and clean selected items
         * The acceptable filter object should be like:
         *  {
         *      property: 'addressType',
         *      modifier: 'ne',
         *      value: "IPADDRESS"
         *  }
         *  It also accepts a filter string like:
         *  "addressType ne 'IPADDRESS' and addressType ne 'ALL_IPV6' and addressType eq 'WILDCARD'"
         *  
         * @param {Object|Array|String} A filter object or an array of filter objects or a filter string
         * @param {String} Optional. Only effective if "filter" is an array.
         *                 It is used to connect each condition, using "and"/"or" connective.
         *                 If not specified, "and" is used. 
         */
        setFilter: function(filter, connective) {
            var currentPara = this.getAvailableUrlParameter(),
                self = this,
                filterUrl = this.getFilterUrl(filter, connective);

            isSetFilter = true;

            if (filterUrl) {
                _.extend(currentPara, {filter: filterUrl});
            } else {
                delete currentPara.filter;
            }

            self.listBuilderModel.getSelectedAllIds(function(response) {
                var ids = self.getAllIds(response);  
                self.unselectItems(ids);
            });

            self.listBuilderModel.unbind('setFilter').bind('setFilter', function(){
                isSetFilter = false;
                self.searchAvailableItems(currentPara);
                self.searchSelectedItems(currentPara);
            });
        }
    });

    return BaseListBuilder;
});
