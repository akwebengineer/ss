/**
 * A view that uses the actionBar widget to render actionBar elements from a configuration object
 *
 * @module ActionBar View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/actionBar/actionBarWidget',
    'widgets/actionBar/conf/configurationSample',
    'lib/dateFormatter/dateFormatter',
    'widgets/actionBar/tests/data/rbacSample',
    'text!widgets/actionBar/tests/templates/actionBarExample.html'
], function (Backbone, ActionBarWidget, actionBarConfiguration, dateFormatter, rbacSample, actionBarExample) {
    var ActionBarView = Backbone.View.extend({

        events: {
            "click #update-action-status": "updateButtonLayoutActionBarStatus"
        },

        initialize: function () {
            this.addTemplates();
            !this.options.pluginView && this.render();
        },

        render: function () {
            this.gridLayoutActionBar = new ActionBarWidget({
                "container": this.$gridLayoutActionBar,
                "subTitle": dateFormatter.format(new Date(), {format: "long"}),
                "actions": actionBarConfiguration.grid,
                "events": this.getEvents(),
                "layout": "grid"//defaults to button layout
            }).build();
            this.buttonLayoutActionBar = new ActionBarWidget({
                "container": this.$buttonLayoutActionBar,
                "subTitle": {
                    "content": "Subtitle for an Action Bar with a long long long long long long long long long long long long long long long long description",
                    "help": {
                        "content": "Tooltip for the subtitle of the Action Bar widget",
                        "ua-help-text": "More..",
                        "ua-help-identifier": "alias_for_ua_event_binding"
                    }
                },
                "actions": actionBarConfiguration.button,
                "events": this.getEvents(),
                "rbac": rbacSample
            }).build();
            this.bindEvents();
            this.unbindEvents(); //test unbind events
            return this;
        },

        getEvents: function () {
            var self = this,
                actionBarEvents = {
                    "edit": {
                        "handler": [self.edit1]
                    },
                    "searchAction": {
                        "handler": [self.search]
                    }
                };
            return actionBarEvents;
        },

        search: function (evt, actionObj) {
            console.log("search callback:");
            console.log(actionObj);
        },

        edit1: function (evt, actionObj) {
            console.log("callback 1:");
            console.log(actionObj);
        },

        edit2: function (evt, actionObj) {
            console.log("callback 2:");
            console.log(actionObj);
        },

        bindEvents: function () {
            var self = this;
            this.buttonLayoutActionBar.bindEvents({
                "edit": {
                    "handler": [self.edit2]
                },
                "downloadJims": {
                    "handler": [self.download1, self.download2]
                }
            });
        },

        download1: function (evt, actionObj) {
            console.log("callback 1:");
            console.log(actionObj);
        },

        download2: function (evt, actionObj) {
            console.log("callback 2:");
            console.log(actionObj);
        },

        unbindEvents: function () {
            var self = this;
            this.buttonLayoutActionBar.unbindEvents({
                "downloadJims": {
                    "handler": [self.download1]
                }
            });
        },

        updateButtonLayoutActionBarStatus: function () {
            this.buttonLayoutActionBar.updateDisabledStatus({
                // "rowMore": false,
                "rowMoreAddAbove": true,
                "rowMoreAddBelow": false,
                "barMoreGroup": false,
                "archive_purge": false,
                "subMenu": false,
                "deleteRows": true,
                "deleteRowsWithoutReset": false,
                "subMenu4": false,
                "publishGrid": false, //enables publishGrid action
                "collapseAll": true //disables collapseAll action
            });
        },

        addTemplates: function () {
            this.$el.append(actionBarExample);
            this.$gridLayoutActionBar = this.$el.find(".grid-style");
            this.$buttonLayoutActionBar = this.$el.find(".button-style");
        }

    });

    return ActionBarView;
});