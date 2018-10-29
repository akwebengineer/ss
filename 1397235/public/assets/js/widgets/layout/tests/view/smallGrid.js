/**
 * A view that uses a configuration object to render a grid widget.
 * It contains a grid with basic data.
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample'
], function(Backbone, GridWidget,configurationSample){
    var GridView = Backbone.View.extend({

        initialize: function () {
            this.actionEvents = {
                testGroupHover: "testGroupHover",
                testDetailsHover: "testDetailsHover",
                editOnRowHover: "editOnRowHover",
                deleteOnRowHover: "deleteOnRowHover"
            };
        },

        render: function () {
            delete configurationSample.smallGrid.title;
            this.grid = new GridWidget({
                container: this.el,
                elements: _.extend({
                        "subTitle": "Second Layout Subtitle - View Type: List",
                        "height": "auto",
                        "viewType": "list",
                        "rowHoverMenu": {
                            "customButtons": [{
                                "label": "Group",
                                "key": "testGroupHover",
                                "icon": "icon_see_group_hover"
                            },{
                                "label": "Details",
                                "key": "testDetailsHover",
                                "disabledStatus": true, //default status
                                "icon": {
                                    default: "icon_details_blue_14x14",
                                    disabled: "icon_details_disabled_14x14"
                                }
                            }]
                        }
                    }, configurationSample.smallGrid
                ),
                actionEvents:this.actionEvents
            });
            this.grid.build();
            return this;
        },

        destroy: function () {
            this.grid.destroy();
        }

    });

    return GridView;
});