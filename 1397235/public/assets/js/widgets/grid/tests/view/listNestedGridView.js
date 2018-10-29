/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'mockjax'
], function (Backbone, GridWidget, gridConfiguration, mockjax) {
    var GridView = Backbone.View.extend({

        events: {
            'click #filter_grid': 'filterGrid'
        },

        initialize: function () {
//            this.mockApiResponse();
            this.actionEvents = {
//                createEvent:"AddFirewallPolicies",
//                updateEvent:"UpdateFirewallPolicies",
//                discardEvent:"DiscardFirewallPolicies",
//                deleteEvent:"DeleteFirewallPolicies",
                testAddHover: "testAddHover_nested",
                editOnRowHover: "editOnRowHover_nested",
                deleteOnRowHover: "deleteOnRowHover_nested",
                testDetailsHover: "testDetailsHover_nested",
                testGroupHover: "testGroupHover_nested",
                selectedEvent: "selectedEvent"
            };
            this.bindGridEvents();
            gridConfiguration.listNestedGrid.tableId = this.options.id;
        },

        render: function () {
            var shortNestedGridConfiguration = $.extend(true, {}, gridConfiguration.nestedGrid);
            delete shortNestedGridConfiguration.title;
            shortNestedGridConfiguration.subTitle = "Zone Policies - Regular Nested Grid";
            shortNestedGridConfiguration.columns = _.first(shortNestedGridConfiguration.columns, 5);
            shortNestedGridConfiguration.subGrid.expandOnLoad = true;
            shortNestedGridConfiguration.rowHoverMenu = this.getRowHoverMenu;

            this.gridWidget = new GridWidget({
                container: this.el,
                elements: shortNestedGridConfiguration,
                actionEvents: this.actionEvents
            }).build();

            this.bindFocusSearchInput();
            this.gridWidget.toggleGridHeader(undefined, ["search", "subheader"]);
            return this;
        },

        getRowHoverMenu: function (rowId) {
            var parentRowIds = ["1", "2", "3"],
                groupTypeRowIds = ["13", "23", "33"];
            if (~parentRowIds.indexOf(rowId)) {
                return {
                    "defaultButtons": { //overwrite default edit and delete grid buttons
                        "edit": false,
                        "delete": false
                    },
                    "customButtons": [
                        {
                            "label": "Add",
                            "key": "testAddHover",
                            "icon": "icon_add_blue_14x14"
                        }
                    ]
                }
            } else if (~groupTypeRowIds.indexOf(rowId)) {
                return {
                    "defaultButtons": { //overwrite default edit and delete grid buttons
                        "delete": false
                    },
                    "customButtons": [
                        {
                            "label": "Details",
                            "key": "testDetailsHover",
                            "icon": "icon_details_blue_14x14"
                        }
                    ]
                }
            }
            return {
                "customButtons": [
                    {
                        "label": "Details",
                        "key": "testDetailsHover",
                        "disabledStatus": true, //default status
//                        "icon": "icon_details_blue_14x14"
                        "icon": {
                            default: "icon_details_blue_14x14",
                            disabled: "icon_details_disabled_14x14"
                        }
                    },
                    {
                        "label": "Group",
                        "key": "testGroupHover",
                        "icon": "icon_see_group_hover"
                    }
                ]
            }
        },

        bindFocusSearchInput: function () {
            var self = this;
            this.$el.bind("gridLoaded", function () {
                self.focusSearchInput();
            });
        },

        focusSearchInput: function () {
            this.gridWidget.getSearchWidgetInstance().focusInput();
        },

        bindGridEvents: function () {
            var self = this;
            this.$el
//                .bind(this.actionEvents.createEvent, function(e, addGridRow){
////                    self.addRow(addGridRow);
//                    console.log(addGridRow);
//                })
//                .bind(this.actionEvents.updateEvent, function(e, updatedGridRow){
////                    self.update(updateGridRow);
//                    console.log(updatedGridRow);
//                })
//                .bind(this.actionEvents.discardEvent, function(e, discardedGridRow){
//                    console.log(discardedGridRow);
//                })
//                .bind(this.actionEvents.deleteEvent, function(e, deletedGridRows){
//                    console.log(deletedGridRows);
//                })
                .bind(this.actionEvents.selectedEvent, function (e, selectedRows) {
//                    console.log(self.actionEvents.selectedEvent + " : ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.testAddHover, function(e, selectedRows){
                    console.log("testAddHover: ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.editOnRowHover, function(e, selectedRows){
                    console.log("editOnRowHover: ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.deleteOnRowHover, function(e, selectedRows){
                    console.log("deleteOnRowHover: ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.testGroupHover, function(e, selectedRows){
                    console.log("Test Clone on Row Hover in the Grid");
                    console.log(selectedRows);
                    console.log(self.gridWidget.getGridHeaderLayout());
                });
        },

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function () {
            $.mockjax({
                url: /^\/api\/security-policy\/global\/policy\/([a-zA-Z0-9\-\_]+)$/,
                urlParams: ["policy"],
                response: function (settings) {
                    var policy = settings.urlParams.policy,
                        policies = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante', '185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____', '189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante', '190002-INS_to_Sircon_drop_em', '191002-LOT_-_VPN_Tunnell_-_Lottery_VPN_Tunnel_-_8_2_2007_-_KTS', '195002-SEC_-_NEMO_Project__-_Waiver___1156_-_Pa__SEC_VPN_connec', '196001-VPN_Cleanup_rule__IPSec_', '201003-Blue_Coat_drop_rule_-_CRQ_4620_04-11-2012_Sante'];
                    if ($.inArray(policy, policies) != -1) {
                        this.responseText = {
                            'name': policy,
                            'source-address': ['any'],
                            'destination-address': ['any'],
                            'application': ['any'],
                            'action': 'reject'
                        };
                        this.status = 200;
                    } else {
                        this.responseText = {
                            type: 'Error',
                            code: 404,
                            message: 'The requested policy does not exist',
                            details: [ ],
                            links: [ ]
                        };
                        this.status = 404;
                    }
                },
                responseTime: 100
            });
        }

    });

    return GridView;
});