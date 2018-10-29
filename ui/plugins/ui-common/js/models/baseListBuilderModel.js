/**
 * Model for basic listBuilder operation
 * 
 * @module BaseListBuilderModel
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../models/spaceModel.js'
], function (SpaceModel) {

    var BaseListBuilderModel = SpaceModel.extend({
        urlRoot: '',
        isGetSelectedItemsFromStoreAsync: true,
        initialize: function () {
            this.setUrl();
            SpaceModel.prototype.initialize.call(this, {
                "contentType": this.selectContentType
            });
        },

        getSelectURL: function () {
            if (this.selectUrl){
                return this.urlRoot + this.selectUrl;
            }else{
                return this.urlRoot;
            }
        },

        getDeSelectURL: function () {
            if (this.deselectUrl){
                return this.urlRoot + this.deselectUrl;
            }else{
                return this.urlRoot;
            }
        },

        getSelectMode: function () {
            return this.selectContentType;
        },

        getDeSelectMode: function () {
            return this.deselectContentType;
        },

        setSelectMode: function () {
            this.requestHeaders.contentType = this.selectContentType;
        },
        setDeSelectMode: function () {
            this.requestHeaders.contentType = this.deselectContentType;
        },

        setUrl: function () {
            this.urlRoot = this.baseUrl + this.generateStoreId();
        },

        getAvailableUrl: function() {
            return this.urlRoot + this.availableUrl;
        },

        getSelectedUrl: function() {
            return this.urlRoot + this.selectedUrl;
        },

        getAvailableAllUrl: function() {
            return this.urlRoot + this.availableAllUrl;
        },

        getSelectedAllUrl: function() {
            return this.urlRoot + this.selectedAllUrl;
        },

        generateStoreId: function() {
            return Math.ceil(Math.random() * 1000000);
        },

        getAvailableItemsFromStore: function(callback) {
            return $.ajax({
                headers: {
                    accept: this.availableAccept 
                },
                type: 'GET',
                url: this.getAvailableUrl(),
                dataType: "json",
                success: function(response, status) {
                   console.log("get all available items");
                   callback(response);
                },
                error: function() {
                    console.log("failed to get available items");
                }
            });
        },

        getAvailableAllIds: function(callback) {
            return $.ajax({
                headers: {
                    accept: this.availableAllAccept 
                },
                type: 'GET',
                url: this.getAvailableAllUrl(),
                dataType: "json",
                success: function(response, status) {
                   console.log("get all available ids");
                   callback(response);
                },
                error: function() {
                    console.log("failed to get available ids");
                }
            });
        },

        getSelectedItemsFromStore: function(callback) {
            return $.ajax({
                headers: {
                    accept: this.selectAccept 
                },
                type: 'GET',
                url: this.getSelectedUrl(),
                dataType: "json",
                success: function(response, status) {
                   console.log("get all selected items");
                   callback(response);
                },
                error: function() {
                    console.log("failed to get selected items");
                },
                async: this.isGetSelectedItemsFromStoreAsync
            });
        },

        getSelectedAllIds: function(callback, urlParam) {
            var data = urlParam ? "_search=" + urlParam : undefined;
            return $.ajax({
                headers: {
                    accept: this.selectAllAccept 
                },
                type: 'GET',
                data: data,
                url: this.getSelectedAllUrl(),
                dataType: "json",
                success: function(response, status) {
                   console.log("get all selected ids");
                   callback(response);
                },
                error: function() {
                    console.log("failed to get selected ids");
                }
            });
        },

        refreshStore: function(callback) {
            return $.ajax({
                headers: {
                    accept: this.availableAccept 
                },
                type: 'GET',
                url: this.getAvailableUrl() + '?reset-store=true',
                dataType: "json",
                success: function(response, status) {
                   console.log("refresh items");
                   callback(response);
                },
                error: function() {
                    console.log("failed to refresh items");
                }
            });
        },

        resetStore: function (callback) {
            $.ajax({
                type: 'DELETE',
                url: this.urlRoot,
                dataType: "json",
                success: function() {
                   console.log("clean item-selector store by id");
                   if (callback)
                       callback();
                },
                error: function() {
                    console.log("failed to delete item-selector store");
                    if (callback)
                       callback();
                }
            });
        }
    });

    return BaseListBuilderModel;
});