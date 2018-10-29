/**
 * List Builder for generic use
 *
 * @module BaseListBuilder
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/listBuilder/listBuilderWidget'
], function (Backbone, ListBuilder) {
    var defaultConf = {
            list: {
                availableElements: []
            }
        };

    var BaseListBuilder = Backbone.View.extend({
        initialize: function(options) {
            this.conf = _.extend(defaultConf, options);
            this._listBuilder = null;
        },
        build: function() {
            var self = this;
            var dataPromise = this.getData(this.conf);
            var buildPromise = $.when(dataPromise)
                .done(function() {
                    self._listBuilder = new ListBuilder(self.conf);
                    self._listBuilder.build();
                })
                .fail(function() {
                    console.log('That was unexpected.');
                });
            return buildPromise;
        },
        getSelectedItems: function() {
            if (this._listBuilder) {
                return this._listBuilder.getSelectedItems();
            }
        },
        setSelectedItems: function(items) {
            if (this._listBuilder) {
                return this._listBuilder.setSelectedItems(items);
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
        getAvailableItems: function () {
            if (this._listBuilder) {
                return this._listBuilder.getAvailableItems();
            }
        },
        setAvailableItems: function (items) {
            if (this._listBuilder) {
                return this._listBuilder.setAvailableItems(items);
            }
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
        destroy: function() {
            if (this._listBuilder) {
                return this._listBuilder.destroy();
            }
        },
        getData: function () {
            var self = this;
            return this.collection && this.collection.fetch({
                    success: function (collection, response, options) {
                        self.conf.list.availableElements = self.buildList(collection);
                    }
                });
        },
        getValueList: function(items) {
            var list = [];
            for (var i=0; i<items.length; i++) {
                if (items[i].value) {
                    list.push(items[i].value);
                }
            }
            return list;
        },
        /**
         * Function to override when you need to edit value for elements in the list
         */
        buildList: function(collection) {
            return collection;
        },
        /**
         * Reset the available items to the new filtered collection values and clear selected items
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
            var self = this;
            return this.collection.fetch({
                url: this.collection.url(filter, connective),
                success: function (collection, response, options) {
                    // Clear selected items
                    self.removeSelectedItems(self.getValueList(self.getSelectedItems()));
                    // Clear current available items
                    self.removeAvailableItems(self.getValueList(self.getAvailableItems()));
                    // Set new filtered items
                    self.addAvailableItems(self.buildList(collection));
                },
                error: function(collection, response, options) {
                    console.log('Failed to get filtered data');
                }
            });
        }
    });

    return BaseListBuilder;
});
