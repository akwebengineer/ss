/**
 * A view that uses the QueryBuilder Widget with drag drop feature along with autoComplete
 * @module  QueryBuilder View
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone',
    'widgets/queryBuilder/queryBuilderWidget',
    'widgets/queryBuilder/conf/configurationSample',
], function (Backbone, QueryBuilderWidget, configurationSample) {

    var DragDropView = Backbone.View.extend({

        events: {
            'click #getQuery_dragDrop': 'getQuery',
        },

        initialize: function () {
            this.$el = $(this.el);
            this.getElements();
            this.render();
        },

        render: function () {
            this.registerDraggableElements();
            this.registerDragDropCallback();
            this.queryBuilderWithDragDrop();
        },

        // example to showcase drag-drop feature in the queryBuilder
        queryBuilderWithDragDrop: function () {
            var $queryContainer = this.$el.find("#queryBuilder_dragDrop_autoComplete");

            var conf = {
                "container": $queryContainer,
                "dragNDrop": {
                    "drop": this.dropOnCallback,
                    "over": this.dragOverCallback
                },
                "autoComplete": true,
                "events": {
                    "query.executeQuery": {
                        "handler": [function (e, queryObj) {
                            console.log("--- Query Executed ---");
                            //console.log(JSON.stringify(queryObj.model, null, 2));
                        }]
                    }
                }
            };
            $.extend(conf, configurationSample.searchConf);
            this.queryBuilderWidget = new QueryBuilderWidget(conf);
            this.queryBuilderWidget.build();
        },

        // Method to register elements as draggable, so that they can be dropped on filterBar
        registerDraggableElements: function () {
            this.id_dragOsversion = "dragOsversion";
            this.id_dragDeviceFamily = "dragDeviceFamily";
            this.id_dragJunosHost = "dragJunosHost";

            this.$el.find("#" + this.id_dragOsversion).draggable({helper: 'clone'});
            this.$el.find("#" + this.id_dragDeviceFamily).draggable({helper: 'clone'});
            this.$el.find("#" + this.id_dragJunosHost).draggable({helper: 'clone'});
        },

        // method to demonstrate the callbacks implementation when the element is dragged on filterBar
        registerDragDropCallback: function () {
            var self = this;

            // callback to provide search data
            this.dropOnCallback = function (event, ui) {
                // create the data that needs to be passed for the drop for each dropped element
                var dropData = {};

                switch (ui.draggable.attr('id')) {
                    case self.id_dragOsversion:
                        dropData.data = [
                            {"label": "OSVersion", "values": ["19.1", "19.2"], "logicalOperator": "NOT"}
                        ];
                        break;
                    case self.id_dragDeviceFamily:
                        dropData.data = [
                            {
                                "label": "DeviceFamily",
                                "values": ["SRX", "EX"],
                                "logicalOperator": "OR",
                                "relationalOperator": "!="
                            }
                        ];
                        break;
                    case self.id_dragJunosHost:
                        dropData.data = [
                            {"values": ["JunosHost"], "logicalOperator": "AND"}
                        ];
                        break;
                }

                return dropData;
            };

            // Callback for when the element is dragged over on the filter Bar
            this.dragOverCallback = function (event, ui) {
                //implement the drag Over scenarios - example styling changes etc
                console.log("Drag Over triggered");
            }
        },

        // Show the value in the model after the element is dropped
        getQuery: function () {
            var query = this.queryBuilderWidget.getQuery();
            this.$getQueryResult.text(query);
        },

        // Find the different elements in the DOM
        getElements: function () {
            var $testButtonsContainer = this.$el.find("#test_buttons_dragDrop");
            this.$getQueryResult = $testButtonsContainer.find("#getQueryResult_dragDrop");
        },
    });

    return DragDropView;
});
